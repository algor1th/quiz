'use strict';

const authentication = require('../authentication.js');
const maria = require('../maria.js');
const joi = require('@hapi/joi');

const schemaRequest = {
    userID: joi.number().required(),
}

module.exports = function(app){

    //get a opened game / create new game
    app.get('/api/games/current', async (req, res) => {
        const token = req.get("authentication");
        var isAuthenticated = await authentication.isAuthenticated(token);
        if(!isAuthenticated){
            res.status(401).send("You did not provide an authorized token with your request")
            return;
        }
        var userID = await authentication.getUserID(token);

        var openedGames = await maria.query('SELECT * FROM games WHERE (userID_1 = ? OR userID_2 = ?) AND isFinished = false',[userID, userID]);
        if(openedGames.length !== 0){
            res.send(openedGames[0]);    
            return;
        }

        openedGames = await maria.query('SELECT * FROM games WHERE userID_2 IS NULL');
        var openedGame;
        if(openedGames.length === 0){
            const firstQuery = await maria.query('INSERT INTO games (userID_1) VALUES (?); SELECT LAST_INSERT_ID();', [userID]);
            openedGame = await maria.query('SELECT * FROM games WHERE id = ?', [firstQuery[1][0]["LAST_INSERT_ID()"]]);     
        }else{
            await maria.query('UPDATE games SET userID_2 = ? WHERE id = ?',[userID, openedGames[0]['id']]);
            openedGame = await maria.query('SELECT * FROM games WHERE id = ?', [openedGames[0]['id']]); 
        }
        res.send(openedGame[0]);    
    });

    //get all opened games
    app.get('/api/games', async (req, res) => {
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAdmin(token);
        if(!isAuthorized){
            res.status(401).send("You did not provide an authorized admin token with your request")
            return;
        }
        
        var games = await maria.query('SELECT * FROM games WHERE isFinished = false');
        if(games.length === 0){
            res.status(404).send(`no open games found`);
            return;
        }        
        res.send(games);    
    });

    //get specific game
    app.get('/api/games/:id', async (req, res) => {
        const token = req.get("authentication");
        var isAdmin = await authentication.isAdmin(token);
        var userID = await authentication.getUserID(token);

        var games = await maria.query('SELECT * FROM games WHERE id = ?', req.params.id);

        var isAuthorized = isAdmin || (games.length > 0 && (games[0]["userID_1"] === userID || games[0]["userID_1"] === userID))
        if(!isAuthorized){
            res.status(401).send("You did not provide an authorized admin token or a token of a user of this game, with your request")
            return;
        }
        
        if(games.length === 0){
            res.status(404).send(`game with id ${req.params.id} not found`);
            return;
        }
    
        if(req.query.containsFullHistory && req.query.containsFullHistory == "true"){
            var rounds = await maria.query('SELECT * FROM rounds WHERE gameID = ? ORDER BY id ASC',[games[0]["id"]]);
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

    var q = [];
    for(var i=1; i<=3; i++){
        q[i-1] = {};
        q[i-1]["answerID_1"] = round["answerID_1_"+i];
        q[i-1]["answerID_2"] = round["answerID_2_"+i];
        var questions = await maria.query('SELECT * FROM questions WHERE id = ?',[round["questionID_"+i]]);
        var answers = await maria.query('SELECT * FROM answers WHERE questionID = ?',[round["questionID_"+i]]);
        questions[0]["answers"] = answers;
        q[i-1]["question"] = questions[0];
    }
    newRound["questions"] = q;
       
    return newRound;
}