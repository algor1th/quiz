'use strict';

const maria = require('../maria.js');
const joi = require('@hapi/joi');

const schemaRequest = {
    userID: joi.number().required(),
    gameID: joi.number().required()
}
const schemaAnswer = {
    userID: joi.number().required(),
    answerID: joi.number().required()
}

module.exports = function(app){

    //get current round for existing game
    app.post('/api/rounds', async (req, res) => {

        const sanitizeResult = joi.validate(req.body, schemaRequest);
        if(sanitizeResult.error){
            res.status(400).send(sanitizeResult.error.details[0].message);
            return;
        }

        var game = await maria.query('SELECT * FROM games WHERE id = ?',[req.body.gameID]);
        if(game.length === 0){
            res.status(404).send(`game with id ${req.body.gameID} not found`);
            return;
        }
        game = game[0]

        var rounds = await maria.query('SELECT * FROM rounds WHERE gameID = ?', [req.body.gameID]);
        var openRound;
        for (var i = 0; i < rounds.length; i++) {
            if(!rounds[i]['answerID_1_3'] || !rounds[i]['answerID_2_3']){
                openRound = rounds[i];
                break;
            }
        }        

        if(openRound){
            //opened round exist
            res.send(serializeRound(openRound));
            return
        }
        
        //no opened round exist
        if(rounds.length === 6){
            res.status(404).send(`game with id ${req.body.gameID} is over but not marked as over. Something went rong internally`);
            return;
        }
        console.log(game['userID_1']);
        if(((game['userID_1'] == req.body.userID) && ((rounds.length % 2) === 0)) || ((game['userID_2'] == req.body.userID) && ((rounds.length % 2) === 1)) ){
            res.status(404).send(`waiting for other play to create a new round`);
            return;
        }
      
        //create new round
        const questions = await maria.query('SELECT * FROM questions ORDER BY RAND() LIMIT 3');

        const firstQuery = await maria.query('INSERT INTO rounds (gameID, questionID_1, questionID_2, questionID_3) VALUES (?, ?, ?, ?); SELECT LAST_INSERT_ID();', [req.body.gameID, questions[0]['id'], questions[1]['id'], questions[2]['id']]);
        const newRound = await maria.query('SELECT * FROM rounds WHERE id = ?', firstQuery[1][0]["LAST_INSERT_ID()"]);
        res.send(serializeRound(newRound));
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
            res.status(404).send(`round with id ${req.params.id} not found`);
            return;
        }

        var openRound = rounds[0]
        var game = await maria.query('SELECT * FROM games WHERE id = ?',[openRound['gameID']]);
        game = game[0];

        for(var i = 1; i<=3; i++){
            if(game['userID_1'] == req.body.userID){
                if(openRound['answerID_1_'+i] === null){
                    const questions = await maria.query('SELECT * FROM answers WHERE id = ? AND questionID = ?', [req.body.answerID, openRound['questionID_'+i],]);
                    if(questions.length === 0){
                        res.status(404).send(`invalid answer with id ${req.body.answerID} for question with id ${openRound['questionID_'+i]}`);
                        return;
                    }
                    const firstQuery = await maria.query('UPDATE rounds SET answerID_1_'+i+' = ? WHERE id = ?', [req.body.answerID, req.params.id]);
                    const updatedRound = await maria.query('SELECT * FROM rounds WHERE id = ?', [req.params.id]);

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
                if(game['userID_2'] == req.body.userID){
                    if(openRound['answerID_2_'+i] === null){
                        const questions = await maria.query('SELECT * FROM answers WHERE id = ? AND questionID = ?', [req.body.answerID, openRound['questionID_'+i]]);
                        if(questions.length === 0){
                            res.status(404).send(`invalid answer with id ${req.body.answerID} for question with id ${openRound['questionID_'+i]}`);
                            return;
                        }
                        const firstQuery = await maria.query('UPDATE rounds SET answerID_2_'+i+' = ? WHERE id = ?', [req.body.answerID, req.params.id]);
                        const updatedRound = await maria.query('SELECT * FROM rounds WHERE id = ?', [req.params.id]);
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
                    res.status(404).send(`the round with id ${req.params.id} has no user ${ req.body.userID}`);
                    return;
                }
            }
        }
        res.status(404).send('The question you are attempting to answer is closed. Waiting for other player to finish round.');
    });  

    
    //get specific game
    app.get('/api/rounds/:id', async (req, res) => {
        const rounds = await maria.query('SELECT * FROM rounds WHERE id = ?', req.params.id);
        if(rounds.length === 0){
            res.status(404).send(`round with id ${req.params.id} not found`);
            return;
        }
        res.send(rounds[0]);    
    });
}  

function serializeRound(round) {
    var newRound = {};
    newRound["id"] = round["id"];
    newRound["gameID"] = round["gameID"];
    newRound["category"] = round["category"];

    var q1 = {};
    q1["questionID"] = round["questionID_1"];
    q1["answerID_1"] = round["answerID_1_1"];
    q1["answerID_2"] = round["answerID_2_1"];
    newRound["question_1"] = q1;

    var q1 = {};
    q1["questionID"] = round["questionID_2"];
    q1["answerID_1"] = round["answerID_1_2"];
    q1["answerID_2"] = round["answerID_2_2"];
    newRound["question_2"] = q1;

    var q1 = {};
    q1["questionID"] = round["questionID_3"];
    q1["answerID_1"] = round["answerID_1_3"];
    q1["answerID_2"] = round["answerID_2_3"];
    newRound["question_3"] = q1;
    
    return newRound;
}