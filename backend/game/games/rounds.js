'use strict';

const authentication = require('../authentication.js');
const maria = require('../maria.js');
const joi = require('@hapi/joi');
var seedrandom = require('seedrandom');
const request = require('request');
const questionTime = require('./questionTime.js');

const schemaAnswer = {
    answerID: joi.number().required()
}
const schemaCategory = {
    categoryID: joi.number().required()
}

module.exports = function(app){

    //get current round for existing game
    app.get('/api/rounds', async (req, res) => {

        //check parameter
        if(!req.query.forGame){
            res.status(400).send(`You cant query api/games without giving an additional parameter`);
        }

        //check if game exists
        var game = await maria.query('SELECT * FROM games WHERE id = ?',[req.query.forGame]);
        if(game.length === 0){
            res.status(404).send(`game with id ${req.query.forGame} not found`);
            return;
        }
        game = game[0]

        //check authentication if player is in round
        const token = req.get("authentication");
        var userID = await authentication.getUserID(token);
        var playerID = 0;
        var isAuthorized = false;
        if(game["userID_1"] === userID){
            playerID = 1;
            isAuthorized = true;
        } 
        if(game["userID_2"] === userID){
            playerID = 2;
            isAuthorized = true;
        }         
        
        if(!isAuthorized){
            res.status(401).send("Your provided token is not valid for a user of the game.")
            return;
        }

        //get rounds for game
        var rounds = await maria.query('SELECT * FROM rounds WHERE gameID = ?', [req.query.forGame]);
        var openRound;
        for (var i = 0; i < rounds.length; i++) {
            if(!rounds[i]['answerID_1_3'] || !rounds[i]['answerID_2_3']){
                openRound = rounds[i];
                break;
            }
        }        

        //respond if an opened round exist
        if(openRound){
            var output = await serializeRound(openRound);
            output["thisPlayer"] = playerID;
            res.send(output);
            return;
        }
        
        //responde if no opened round exist
        if(rounds.length === 6){
            res.status(404).send(`game with id ${req.query.forGame} is over but not marked as over. Something went wrong internally`);
            return;
        }
        if(((game['userID_1'] == userID) && ((rounds.length % 2) === 0)) || ((game['userID_2'] == userID) && ((rounds.length % 2) === 1)) ){
            res.status(404).send(`waiting for other play to create a new round`);
            return;
        } 

        if(game['userID_2'] === null){
            res.status(404).send(`waiting for other play to join the game, bevore beginning`);
            return;
        }
        var maxLevel = Math.min(await authentication.getUserLevel(token, game["userID_1"]), await authentication.getUserLevel(token, game["userID_2"]))

        var categories = await getRandomCategories(req.query.forGame, rounds.length, maxLevel);
        var response = {};
        response["gameID"] = req.query.forGame;
        response["category"]= categories;
        res.send(response);
        return;
    });  

    //answer the current question. Closes round if finished, closes the game if finished
    app.put('/api/rounds/:id', async (req, res) => {
       
        //check if answer
        var sanitizeResult = joi.validate(req.body, schemaAnswer);
        if(sanitizeResult.error){
            var sanitizeResult = joi.validate(req.body, schemaCategory);
            if(sanitizeResult.error){
                res.status(400).send(sanitizeResult.error.details[0].message);
                return;
            }else{
                await handleCategory(req, res)
            }
        }else{
            await handleAnswer(req, res)
        }        
    });  

    
    //get specific game
    app.get('/api/rounds/:id', async (req, res) => {
        const token = req.get("authentication");
        var isAdmin = await authentication.isAdmin(token);
        var userID = await authentication.getUserID(token);

        const rounds = await maria.query('SELECT * FROM rounds WHERE id = ?', req.params.id);
        if(rounds.length === 0){
            if(!isAdmin){
                res.status(401).send("You did not provide an authorized admin token or a token of a user of this round, with your request")
                return;
            }
            res.status(404).send(`round with id ${req.params.id} not found`);
            return;
        }

        var games = await maria.query('SELECT * FROM games WHERE id = ?', rounds[0]["gameID"]);

        var isAuthorized = isAdmin || (games.length > 0 && (games[0]["userID_1"] === userID || games[0]["userID_1"] === userID))
        if(!isAuthorized){
            res.status(401).send("You did not provide an authorized admin token or a token of a user of this game, with your request")
            return;
        }

        var serializedRound = await serializeRound(rounds[0]);
        res.send(serializedRound);    
    });
}  

async function serializeRound(round) {
    var newRound = {};
    newRound["id"] = round["id"];
    newRound["gameID"] = round["gameID"];

    var allCategories = await maria.query('SELECT * FROM categories');
    newRound["category"] = allCategories[round["category"]];

    var q = [];

    for(var i=1; i<=3; i++){
        q[i-1] = {};
        q[i-1]["questionID"] = round["questionID_"+i];
        q[i-1]["answerID_1"] = round["answerID_1_"+i];
        q[i-1]["answerID_2"] = round["answerID_2_"+i];
    }
    newRound["questions"] = q;
    return newRound;
}

async function getRandomCategories(gameID, roundNumber, maxLevel){
    var allCategories = await maria.query('SELECT * FROM categories');

    var rng = seedrandom(gameID+" "+roundNumber);
    var rounds = [];
    while(rounds.length<3){
        var i = parseInt(rng()*allCategories.length);
        if(!rounds.includes(allCategories[i]) && allCategories[i] != null && allCategories[i]['requiredLevel'] <= maxLevel)
            rounds.push(allCategories[i]);
    }
    return rounds;
}


async function handleAnswer(req, res){
    var rounds = await maria.query('SELECT * FROM rounds WHERE id = ?',[req.params.id]);
        if(rounds.length === 0){
            res.status(401).send("Something went wrong with verifying your token. The round you ask may not exist or you have no valid token for the round.")
            return;            
        }

        var openRound = rounds[0]
        var game = await maria.query('SELECT * FROM games WHERE id = ?',[openRound['gameID']]);
        game = game[0];

        const token = req.get("authentication");
        var userID = await authentication.getUserID(token);
        var isAuthorized = game["userID_1"] === userID || game["userID_2"] === userID;
        if(!isAuthorized){
            res.status(401).send("Something went wrong with verifying your token. The round you ask may not exist or you have no valid token for the round.")
            return;
        }

        for(var i = 1; i<=3; i++){
            if(game['userID_1'] == userID){
                if(openRound['answerID_1_'+i] === null){
                    const questions = await maria.query('SELECT * FROM answers WHERE id = ? AND questionID = ?', [req.body.answerID, openRound['questionID_'+i]]);
                    const question = (await maria.query('SELECT * FROM questions WHERE id = ?', [openRound['questionID_'+i]]))[0];
                    if(questions.length === 0){
                        res.status(404).send(`invalid answer with id ${req.body.answerID} for question with id ${openRound['questionID_'+i]}`);
                        return;
                    }

                    var inTime = questionTime.tryEndQuestion(userID,question['id'],openRound['id'],question['answerTime']);
                    if(inTime){
                        await maria.query('UPDATE rounds SET answerID_1_'+i+' = ? WHERE id = ?', [req.body.answerID, req.params.id]);
                    }else{
                        await maria.query('UPDATE rounds SET answerID_1_'+i+' = ? WHERE id = ?', [0, req.params.id]);
                    }
                    var updatedRound = await maria.query('SELECT * FROM rounds WHERE id = ?', [req.params.id]);
                    updatedRound = updatedRound[0];

                    var serializedRound = await serializeRound(updatedRound);

                    if(updatedRound['answerID_1_3'] !== null && updatedRound['answerID_2_3'] !== null){
                        var rounds = await maria.query('SELECT * FROM rounds WHERE gameID = ?',[game["id"]]);
                        questionTime.finishRound(updatedRound['id']);
                        
                        if(rounds.length > 5){
                            serializedRound['scoring'] = await doScoring(rounds, game, token);
                            var userID_1 = game['userID_1'];
                            var userID_2 = game['userID_2'];
                            var isFinished = 1;
                            if(serializedRound['scoring']['winner'] === 1)
                                userID_2 = -userID_2;
                            if(serializedRound['scoring']['winner']  === 2)
                                userID_1 = -userID_1;
                            if(serializedRound['scoring']['winner'] != 0)
                                isFinished = serializedRound['scoring']['change'];
                            const firstQuery = await maria.query('UPDATE games SET isFinished = ?, userID_1 = ?, userID_2 = ? WHERE id = ?', [isFinished, userID_1, userID_2, game["id"]]);
                        }
                    }
                    res.send(serializedRound); 
                    return;
                }
            }else{
                if(game['userID_2'] == userID){
                    if(openRound['answerID_2_'+i] === null){
                        const questions = await maria.query('SELECT * FROM answers WHERE id = ? AND questionID = ?', [req.body.answerID, openRound['questionID_'+i]]);
                        const question = (await maria.query('SELECT * FROM questions WHERE id = ?', [openRound['questionID_'+i]]))[0];
                        if(questions.length === 0){
                            res.status(404).send(`invalid answer with id ${req.body.answerID} for question with id ${openRound['questionID_'+i]}`);
                            return;
                        }
    
                        var inTime = questionTime.tryEndQuestion(userID,question['id'],openRound['id'],question['answerTime']);
                        if(inTime){
                            await maria.query('UPDATE rounds SET answerID_2_'+i+' = ? WHERE id = ?', [req.body.answerID, req.params.id]);
                        }else{
                            await maria.query('UPDATE rounds SET answerID_2_'+i+' = ? WHERE id = ?', [0, req.params.id]);
                        }
                        
                        var updatedRound = await maria.query('SELECT * FROM rounds WHERE id = ?', [req.params.id]);
                        updatedRound = updatedRound[0];

                        var serializedRound = await serializeRound(updatedRound);

                        if(updatedRound['answerID_1_3'] !== null && updatedRound['answerID_2_3'] !== null){
                            var rounds = await maria.query('SELECT * FROM rounds WHERE gameID = ?',[game["id"]]);
                            questionTime.finishRound(updatedRound["id"]);
                            
                            if(rounds.length  > 5){
                                serializedRound['scoring'] = await doScoring(rounds, game, token);    
                                var userID_1 = game['userID_1'];
                                var userID_2 = game['userID_2'];
                                var isFinished = 1;
                                if(serializedRound['scoring']['winner'] === 1)
                                    userID_2 = -userID_2;
                                if(serializedRound['scoring']['winner']  === 2)
                                    userID_1 = -userID_1;
                                if(serializedRound['scoring']['winner'] != 0)
                                    isFinished = serializedRound['scoring']['change'];
                                const firstQuery = await maria.query('UPDATE games SET isFinished = ?, userID_1 = ?, userID_2 = ? WHERE id = ?', [isFinished, userID_1, userID_2, game["id"]]);

                            }
                        }
                        var serializedRound = await serializeRound(updatedRound);
                        res.send(serializedRound);  
                        return;
                    }
                }else{
                    res.status(404).send(`the round with id ${req.params.id} has no user ${userID}`);
                    return;
                }
            }
        }
        res.status(404).send('The question you are attempting to answer is closed. Waiting for other player to finish round.');
}
async function handleCategory(req, res){
        
    //check if game exists
    var game = await maria.query('SELECT * FROM games WHERE id = ?',[req.params.id]);
    if(game.length === 0){
        res.status(404).send(`game with id ${req.params.id} not found`);
        return;
    }
    game = game[0]
        
    //check authentication if player is in round
    const token = req.get("authentication");
    var userID = await authentication.getUserID(token);
    var playerID = 0;
    var isAuthorized = false;
    if(game["userID_1"] === userID){
        playerID = 1;
        isAuthorized = true;
    } 
    if(game["userID_2"] === userID){
        playerID = 2;
        isAuthorized = true;
    }         
    
    if(!isAuthorized){
        res.status(401).send("Your provided token is not valid for a user of the game.")
        return;
    }
        
       //get rounds for game
       var rounds = await maria.query('SELECT * FROM rounds WHERE gameID = ?', [req.params.id]); 
       var openRound;
       for (var i = 0; i < rounds.length; i++) {
           if(!rounds[i]['answerID_1_3'] || !rounds[i]['answerID_2_3']){
               openRound = rounds[i];
               break;
           }
       }        
        
        //respond if an opened round exist
        if(openRound || rounds.length === 6 ){
            res.status(404).send(`It is not expected that you choose a category currently!`);
            return;
        }
        if(((game['userID_1'] == userID) && ((rounds.length % 2) === 0)) || ((game['userID_2'] == userID) && ((rounds.length % 2) === 1)) ){
            res.status(404).send(`waiting for other play to choose a category`);
            return;
        } 

        var maxLevel = Math.min(await authentication.getUserLevel(token, game["userID_1"]), await authentication.getUserLevel(token, game["userID_2"]))
        var categories = await getRandomCategories(req.params.id, rounds.length, maxLevel);
        var isContained = false;
        for(var i=0; i< categories.length; i++){
            if(categories[i]["id"]==req.body.categoryID){
                isContained = true;
                break;
            }
        }
        if(!isContained){
            res.status(404).send(`You tried select an invalid category`);
            return;
        }      
        
        //creates new round
        const questions = await maria.query('SELECT * FROM questions WHERE categoryID = ? AND requiredLevel <= ? ORDER BY RAND() LIMIT 3', [req.body.categoryID, maxLevel]);
        const firstQuery = await maria.query('INSERT INTO rounds (gameID, category, questionID_1, questionID_2, questionID_3) VALUES (?, ?, ?, ?, ?); SELECT LAST_INSERT_ID();', [req.params.id, parseInt(req.body.categoryID) ,questions[0]['id'], questions[1]['id'], questions[2]['id']]);
        const newRound = await maria.query('SELECT * FROM rounds WHERE id = ?', firstQuery[1][0]["LAST_INSERT_ID()"]);
                        
        //respond new round
        var output = await serializeRound(newRound[0]);
        output["thisPlayer"] = playerID;
        res.send(output);
        return;

}

async function doScoring(rounds, game, userToken){
    //round is over, get correct answers of each player
    var correct_1 = 0;
    var correct_2 = 0;

    for(var i=0; i<rounds.length; i++){
         for(var j=1; j<=3; j++){
             var answer = (await maria.query('SELECT * FROM answers WHERE id = ?',[rounds[i]["answerID_1_"+j]]))[0];
             if(answer["isCorrect"]===1)
                 correct_1++;
             answer = (await maria.query('SELECT * FROM answers WHERE id = ?',[rounds[i]["answerID_2_"+j]]))[0];
             if(answer["isCorrect"]===1)
                 correct_2++;
         }
    }

    //get current scores of each player
    var user_1 = await authentication.getUserByID(userToken,game['userID_1']);;
    var user_2 = await authentication.getUserByID(userToken,game['userID_2']);;

    var score_1 = user_1['score'];
    var score_2 = user_2['score'];


    //edit scores
    var change = 0;
    var result = {}
    result['winner'] = 0;
    if(correct_1>correct_2){
        var factor = score_2/score_1;
        var dif = correct_1-correct_2;
        change = Math.round(Math.min(score_2,factor*dif));
        score_1 += change;
        score_2 -= change;
        result['winner'] = 1;
    }
    if(correct_1<correct_2){
        var factor = score_1/score_2;
        var dif = correct_2-correct_1;
        change = Math.round(Math.min(score_1,factor*dif));
        score_1 -= change;
        score_2 += change;
        result['winner'] = 2;
    }
    result['change'] = change;

    //send to server
    const userServerURL = process.env.USERSERVER;
    const userServerAdminToken = process.env.USERSERVERADMINTOKEN;

    await request.put(userServerURL+'/api/users/'+user_1['userID'], {
        headers:{
            'content-type': 'application/json',
            'authentication': userServerAdminToken,
        },
        body: JSON.stringify({
            name: user_1['name'], 
            score: score_1, 
            level: user_1['level'], 
        })
    });
    await request.put(userServerURL+'/api/users/'+user_2['userID'], {
        headers:{
            'content-type': 'application/json',
            'authentication': userServerAdminToken,
        },
        body: JSON.stringify({
            name: user_2['name'], 
            score: score_2, 
            level: user_2['level'], 
        })
    });

    return result;
}