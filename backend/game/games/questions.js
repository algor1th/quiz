'use strict';

const authentication = require('../authentication.js');
const maria = require('../maria.js');
const joi = require('@hapi/joi');
const questionTime = require('./questionTime.js');

const schemaQuestion = {
    text: joi.string().min(3).required().max(1024),
    categoryID: joi.number().required(),
    requiredLevel: joi.number().required(),
    score: joi.number().required(),
    answerTime: joi.number().required()
}

module.exports = function(app){
    
    //get all questions
    app.get('/api/questions', async (req, res) => {
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAdmin(token);
        if(!isAuthorized){
            res.status(401).send("You did not provide an authorized admin token with your request")
            return;
        }

        var questions = await maria.query('SELECT * FROM questions');
        var response = [];

        if(req.query.containAnswers && req.query.containAnswers == "true"){
            for (var i = 0; i < questions.length; i++) { 
                var answers = await maria.query('SELECT * FROM answers WHERE questionID = ?',[questions[i]["id"]]);
                response.push([questions[i],answers]);
            }
        }else{
            response = questions;
        }

        res.send(response);    
    });

    //get specific question
    app.get('/api/questions/:id', async (req, res) => {
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAuthenticated(token);
        if(!isAuthorized){
            res.status(401).send("You did not provide an authorized token with your request")
            return;
        }

        const question = await maria.query('SELECT * FROM questions WHERE id = ?', req.params.id);
        var response;

        if(question.length === 0){
            res.status(404).send(`question with id ${req.params.id} not found`);
            return;
        }
        
        if(req.query.containAnswers && req.query.containAnswers == "true"){
            var answers = await maria.query('SELECT * FROM answers WHERE questionID = ?',[req.params.id]);
            response = [question[0],answers];
        }else{
            response = question[0];
        }
        
        var referenceRoundID = 0;
        if(req.query.forRound)
            referenceRoundID = req.query.forRound;
        questionTime.startQuestion(await authentication.getUserID(token),req.params.id,referenceRoundID);

        res.send(response);    
    });

    //add question
    app.post('/api/questions', async (req, res) => {
      
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAdmin(token);
        if(!isAuthorized){
            res.status(401).send("You did not provide an authorized admin token with your request")
            return;
        }

        const sanitizeResult = joi.validate(req.body, schemaQuestion);
        if(sanitizeResult.error){
            res.status(400).send(sanitizeResult.error.details[0].message);
            return;
        }

        const firstQuery = await maria.query('INSERT INTO questions (text, categoryID, requiredLevel, score, answerTime) VALUES (?, ?, ?, ?, ?); SELECT LAST_INSERT_ID();', [req.body.text, req.body.categoryID, req.body.requiredLevel, req.body.categoryID.score, req.body.answerTime]);
        const newQuestion = await maria.query('SELECT * FROM questions WHERE id = ?', firstQuery[1][0]["LAST_INSERT_ID()"]);
        res.send(newQuestion[0]);  
    });

    //update question
    app.put('/api/questions/:id', async (req, res) => {        
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAdmin(token);
        if(!isAuthorized){
            res.status(401).send("You did not provide an authorized admin token with your request")
            return;
        }
        
        const question = await maria.query('SELECT * FROM questions WHERE id = ?', req.params.id);
        if(question.length === 0){
            res.status(404).send(`question with id ${req.params.id} not found`);
            return;
        }
           
        const sanitizeResult = joi.validate(req.body, schemaQuestion);
        if(sanitizeResult.error){
            res.status(400).send(sanitizeResult.error.details[0].message);
            return;
        }
    
        const firstQuery = await maria.query('UPDATE questions SET text = ?, categoryID = ?, requiredLevel = ?, score = ?, answerTime = ? WHERE id = ?', [req.body.text, req.body.categoryID, req.body.requiredLevel, req.body.score, req.body.answerTime, req.params.id]);
        const updatedQuestion = await maria.query('SELECT * FROM questions WHERE id = ?', [req.params.id]);

        res.send(updatedQuestion[0]);
    });

    //delete question
    app.delete('/api/questions/:id', async (req, res) => {
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAdmin(token);
        if(!isAuthorized){
            res.status(401).send("You did not provide an authorized admin token with your request")
            return;
        }
        
        const deletedQuestion = await maria.query('SELECT * FROM questions WHERE id = ?', [req.params.id]);
        if(deletedQuestion.length === 0){
            res.status(404).send(`question with id ${req.params.id} not found`);
            return;
        }
        await maria.query('DELETE FROM questions WHERE id = ?',[req.params.id]);
        res.send(deletedQuestion[0]);
    });
}  