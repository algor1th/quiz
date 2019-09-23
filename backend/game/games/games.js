'use strict';

const authentication = require('../authentication.js');
const maria = require('../maria.js');
const joi = require('@hapi/joi');

const schemaRequest = {
    userID: joi.number().required(),
}

module.exports = function(app){

    //get a opened game
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
            res.send(openedGames);    
            return;
        }
        res.status(404).send("No opened games found")
    });

    //create new game
    app.post('/api/games/current', async (req, res) => {
        const token = req.get("authentication");
        var isAuthenticated = await authentication.isAuthenticated(token);
        if(!isAuthenticated){
            res.status(401).send("You did not provide an authorized token with your request")
            return;
        }
        var userID = await authentication.getUserID(token);

        if(!req.query.matchWith){       
            //random opponent
            openedGames = await maria.query('SELECT * FROM games WHERE userID_2 IS NULL');
            //check if player already has an opened unmatched game
            for(var i=0; i<openedGames.length; i++){
                if(openedGames[i]["userID_1"] == userID){
                    res.status(404).send("You have already an open unmatched game!");
                    return;
                }
            }  

            //match with opened games if no game between these players exist
            for(var i=0; i<openedGames.length; i++){
                var alreadyActiveGames = await maria.query('SELECT * FROM games WHERE ((userID_1 = ? AND userID_2 = ?) OR (userID_1 = ? AND userID_2 = ?)) AND isFinished = 0',[openedGames[i]["userID_1"], userID, userID, openedGames[i]["userID_1"]]);
                if(alreadyActiveGames.length === 0){
                    await maria.query('UPDATE games SET userID_2 = ? WHERE id = ?',[userID, openedGames[i]['id']]);
                    var openedGame = await maria.query('SELECT * FROM games WHERE id = ?', [openedGames[i]['id']]); 
                    res.send(openedGame[0]);    
                    return;
                }
            } 
            
            //create a new game
            const firstQuery = await maria.query('INSERT INTO games (userID_1) VALUES (?); SELECT LAST_INSERT_ID();', [userID]);
            var openedGame = await maria.query('SELECT * FROM games WHERE id = ?', [firstQuery[1][0]["LAST_INSERT_ID()"]]);         
            res.send(openedGame[0]);    
            return;
        }else{
            //specific target
            var otherUser = req.query.matchWith;
            if(userID == otherUser){
                res.status(404).send("You can not match with yourself!")
                return; 
            } 
            var openedGames = await maria.query('SELECT * FROM games WHERE ((userID_1 = ? AND userID_2 = ?) OR (userID_1 = ? AND userID_2 = ?)) AND isFinished = 0',[userID, otherUser, otherUser, userID]);
            if(openedGames.length > 0){
                res.status(404).send("You are already playing against this opponent")
                return;
            }
            const firstQuery = await maria.query('INSERT INTO games (userID_1, userID_2) VALUES (?, ?); SELECT LAST_INSERT_ID();', [userID, otherUser]);
            openedGame = await maria.query('SELECT * FROM games WHERE id = ?', [firstQuery[1][0]["LAST_INSERT_ID()"]]); 
            res.send(openedGame[0]);    
        }
    });

    //get all games
    app.get('/api/games', async (req, res) => {
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAdmin(token);
        if(!isAuthorized){
            res.status(401).send("You did not provide an authorized admin token with your request")
            return;
        }
        
        var games = await maria.query('SELECT * FROM games');
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

        var isAuthorized = isAdmin || (games.length > 0 && (games[0]["userID_1"] === userID || games[0]["userID_2"] === userID))
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

    var allCategories = await maria.query('SELECT * FROM categories');
    newRound["category"] = allCategories[round["category"]];

    //console.log(allCategories[round["category"]])

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