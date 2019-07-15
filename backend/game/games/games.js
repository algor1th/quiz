'use strict';

const maria = require('../maria.js');
const joi = require('@hapi/joi');

const schemaRequest = {
    userID: joi.number().required(),
}

module.exports = function(app){

    //get a opened game / create new game
    app.post('/api/games', async (req, res) => {
        const sanitizeResult = joi.validate(req.body, schemaRequest);
        if(sanitizeResult.error){
            res.status(400).send(sanitizeResult.error.details[0].message);
            return;
        }

        var openedGames = await maria.query('SELECT * FROM games WHERE (userID_1 = ? OR userID_2 = ?) AND isFinished = false',[req.body.userID, req.body.userID]);
        if(openedGames.length !== 0){
            res.send(openedGames[0]);    
            return;
        }

        openedGames = await maria.query('SELECT * FROM games WHERE userID_2 IS NULL');
        var openedGame;
        if(openedGames.length === 0){
            const firstQuery = await maria.query('INSERT INTO games (userID_1) VALUES (?); SELECT LAST_INSERT_ID();', [req.body.userID]);
            openedGame = await maria.query('SELECT * FROM games WHERE id = ?', [firstQuery[1][0]["LAST_INSERT_ID()"]]);     
        }else{
            await maria.query('UPDATE games SET userID_2 = ? WHERE id = ?',[req.body.userID, openedGames[0]['id']]);
            openedGame = await maria.query('SELECT * FROM games WHERE id = ?', [openedGames[0]['id']]); 
        }
        res.send(openedGame[0]);    
    });

    //get specific game
    app.get('/api/games/:id', async (req, res) => {
        var games = await maria.query('SELECT * FROM games WHERE id = ?', req.params.id);
        if(games.length === 0){
            res.status(404).send(`game with id ${req.params.id} not found`);
            return;
        }
    
        if(req.query.containsFullHistory && req.query.containsFullHistory == "true"){
            var rounds = await maria.query('SELECT * FROM rounds WHERE gameID = ?',[games[0]["id"]]);
            var serializedRounds = []
            for(var i=0; i< rounds.length; i++){
                serializedRounds[i] = await serializeRound(rounds[i]);
            }

            games = games[0];
            games["rounds"] = serializedRounds;
        }else{
            games = games[0];
        }
        
        res.send(games);    
    });
}  

async function serializeRound(round) {
    var newRound = {};
    newRound["id"] = round["id"];
    newRound["category"] = round["category"];

    for(var i=1; i<=3; i++){
        var q = {};
        q["answerID_1"] = round["answerID_1_"+i];
        q["answerID_2"] = round["answerID_2_"+i];
        var questions = await maria.query('SELECT * FROM questions WHERE id = ?',[round["questionID_"+i]]);
        var answers = await maria.query('SELECT * FROM answers WHERE questionID = ?',[round["questionID_"+i]]);
        questions[0]["answers"] = answers;
        q["question"] = questions[0];
        newRound["question_"+i] = q;
    }
       
    return newRound;
}