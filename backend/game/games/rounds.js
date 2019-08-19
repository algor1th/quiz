'use strict';

const authentication = require('../authentication.js');
const maria = require('../maria.js');
const joi = require('@hapi/joi');

const schemaAnswer = {
    answerID: joi.number().required()
}

module.exports = function(app){

    //get current round for existing game
    app.get('/api/rounds', async (req, res) => {

        if(!req.query.forGame){
            res.status(400).send(`You cant query api/games without giving an additional parameter`);
        }

        var game = await maria.query('SELECT * FROM games WHERE id = ?',[req.query.forGame]);
        if(game.length === 0){
            res.status(404).send(`game with id ${req.query.forGame} not found`);
            return;
        }
        game = game[0]

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

        var rounds = await maria.query('SELECT * FROM rounds WHERE gameID = ?', [req.query.forGame]);
        var openRound;
        for (var i = 0; i < rounds.length; i++) {
            if(!rounds[i]['answerID_1_3'] || !rounds[i]['answerID_2_3']){
                openRound = rounds[i];
                break;
            }
        }        

        if(openRound){
            //opened round exist
            var output = serializeRound(openRound);
            output["thisPlayer"] = playerID;
            res.send(output);
            return;
        }
        
        //no opened round exist
        if(rounds.length === 6){
            res.status(404).send(`game with id ${req.query.forGame} is over but not marked as over. Something went wrong internally`);
            return;
        }
        if(((game['userID_1'] == userID) && ((rounds.length % 2) === 0)) || ((game['userID_2'] == userID) && ((rounds.length % 2) === 1)) ){
            res.status(404).send(`waiting for other play to create a new round`);
            return;
        }
      
        //create new round
        const questions = await maria.query('SELECT * FROM questions ORDER BY RAND() LIMIT 3');

        const firstQuery = await maria.query('INSERT INTO rounds (gameID, questionID_1, questionID_2, questionID_3) VALUES (?, ?, ?, ?); SELECT LAST_INSERT_ID();', [req.query.forGame, questions[0]['id'], questions[1]['id'], questions[2]['id']]);
        const newRound = await maria.query('SELECT * FROM rounds WHERE id = ?', firstQuery[1][0]["LAST_INSERT_ID()"]);
        
        //add here
        var output = serializeRound(newRound[0]);
        output["thisPlayer"] = playerID;
        res.send(output);
        return;
    });  

    //answer the current question. Closes round if finished, closes the game if finished
    app.put('/api/rounds/:id', async (req, res) => {
       
        const sanitizeResult = joi.validate(req.body, schemaAnswer);
        if(sanitizeResult.error){
            res.status(400).send(sanitizeResult.error.details[0].message);
            return;
        }

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
                    const questions = await maria.query('SELECT * FROM answers WHERE id = ? AND questionID = ?', [req.body.answerID, openRound['questionID_'+i],]);
                    if(questions.length === 0){
                        res.status(404).send(`invalid answer with id ${req.body.answerID} for question with id ${openRound['questionID_'+i]}`);
                        return;
                    }
                    const firstQuery = await maria.query('UPDATE rounds SET answerID_1_'+i+' = ? WHERE id = ?', [req.body.answerID, req.params.id]);
                    var updatedRound = await maria.query('SELECT * FROM rounds WHERE id = ?', [req.params.id]);
                    updatedRound = updatedRound[0];

                    if(updatedRound['answerID_1_3'] !== null && updatedRound['answerID_2_3'] !== null){
                        var rounds = await maria.query('SELECT * FROM rounds WHERE gameID = ?',[game["id"]]);
                        if(rounds.length === 6){
                            const firstQuery = await maria.query('UPDATE games SET isFinished = 1 WHERE id = ?', [game["id"]]);
                        }
                    }
                    res.send(serializeRound(updatedRound));
                    return;
                }
            }else{
                if(game['userID_2'] == userID){
                    if(openRound['answerID_2_'+i] === null){
                        const questions = await maria.query('SELECT * FROM answers WHERE id = ? AND questionID = ?', [req.body.answerID, openRound['questionID_'+i]]);
                        if(questions.length === 0){
                            res.status(404).send(`invalid answer with id ${req.body.answerID} for question with id ${openRound['questionID_'+i]}`);
                            return;
                        }
                        const firstQuery = await maria.query('UPDATE rounds SET answerID_2_'+i+' = ? WHERE id = ?', [req.body.answerID, req.params.id]);
                        var updatedRound = await maria.query('SELECT * FROM rounds WHERE id = ?', [req.params.id]);
                        updatedRound = updatedRound[0];

                        if(updatedRound['answerID_1_3'] !== null && updatedRound['answerID_2_3'] !== null){
                            var rounds = await maria.query('SELECT * FROM rounds WHERE gameID = ?',[game["id"]]);
                            if(rounds.length === 6){
                                const firstQuery = await maria.query('UPDATE games SET isFinished = 1 WHERE id = ?', [game["id"]]);
                            }
                        }
                        res.send(serializeRound(updatedRound));
    
                        return;
                    }
                }else{
                    res.status(404).send(`the round with id ${req.params.id} has no user ${userID}`);
                    return;
                }
            }
        }
        res.status(404).send('The question you are attempting to answer is closed. Waiting for other player to finish round.');
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

        res.send(serializeRound(rounds[0]));    
    });
}  

function serializeRound(round) {
    var newRound = {};
    newRound["id"] = round["id"];
    newRound["gameID"] = round["gameID"];
    newRound["category"] = round["category"];

    var q = [];

    for(var i=1; i<=3; i++){
        q[i-1] = {};
        q[i-1]["questionID"] = round["questionID_"+i];
        q[i-1]["answerID_1"] = round["answerID_1_"+i];
        q[i-1]["answerID_2"] = round["answerID_2_"+i];
    }
    newRound["questions"] = q;
    console.log(round)
    return newRound;
}