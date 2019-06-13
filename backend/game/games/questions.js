'use strict';

const maria = require('../maria.js');
const joi = require('@hapi/joi');

const schemaQuestion = {
    text: joi.string().min(3).required().max(1024),
}

module.exports = function(app){
    
    //get all questions
    app.get('/api/questions', async (req, res) => {
        var questions = await maria.query('SELECT * FROM questions');
        res.send(questions);   
    });

    //get specific question
    app.get('/api/questions/:id', async (req, res) => {
        const question = await maria.query('SELECT * FROM questions WHERE id = ?', req.params.id);
        if(question.length === 0){
            res.status(404).send(`question with id ${req.params.id} not found`);
            return;
        }
        res.send(question);    
    });

    //add question
    app.post('/api/questions', async (req, res) => {
      
        const sanitizeResult = joi.validate(req.body, schemaQuestion);
        if(sanitizeResult.error){
            res.status(400).send(sanitizeResult.error.details[0].message);
            return;
        }

        const firstQuery = await maria.query('INSERT INTO questions (text) VALUES (?); SELECT LAST_INSERT_ID();', [req.body.text]);
        const newQuestion = await maria.query('SELECT * FROM questions WHERE id = ?', firstQuery[1][0]["LAST_INSERT_ID()"]);
        res.send(newQuestion);  
    });

    //update question
    app.put('/api/questions/:id', async (req, res) => {
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
    
        const firstQuery = await maria.query('UPDATE questions SET text = ? WHERE id = ?', [req.body.text, req.params.id]);
        const updatedQuestion = await maria.query('SELECT * FROM questions WHERE id = ?', [req.params.id]);

        res.send(updatedQuestion);
    });

    //delete question
    app.delete('/api/questions/:id', async (req, res) => {
        const deletedQuestion = await maria.query('SELECT * FROM questions WHERE id = ?', [req.params.id]);
        if(deletedQuestion.length === 0){
            res.status(404).send(`question with id ${req.params.id} not found`);
            return;
        }
        await maria.query('DELETE FROM questions WHERE id = ?',[req.params.id]);
        res.send(deletedQuestion);
    });
}  