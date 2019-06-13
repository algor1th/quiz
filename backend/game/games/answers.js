'use strict';

const maria = require('../maria.js');
const joi = require('@hapi/joi');

const schemaAnswer = {
    text: joi.string().min(3).max(512).required(),
    questionID: joi.number().required(),
    isCorrect: joi.bool().required(),
}

module.exports = function(app){
    
    //get all answers
    app.get('/api/answers', async (req, res) => {
        var answers;
        if(req.query.forQuestion){
            var answers = await maria.query('SELECT * FROM answers WHERE questionID = ?',[req.query.forQuestion]);
        }else{
            var answers = await maria.query('SELECT * FROM answers');
        }
        res.send(answers);   
    });

    //get specific answer
    app.get('/api/answers/:id', async (req, res) => {
        const answer = await maria.query('SELECT * FROM answers WHERE id = ?', req.params.id);
        if(answer.length === 0){
            res.status(404).send(`answer with id ${req.params.id} not found`);
            return;
        }
        res.send(answer);    
    });

    //add answer
    app.post('/api/answers', async (req, res) => {
      
        const sanitizeResult = joi.validate(req.body, schemaAnswer);
        if(sanitizeResult.error){
            res.status(400).send(sanitizeResult.error.details[0].message);
            return;
        }

        const firstQuery = await maria.query('INSERT INTO answers (text, questionID, isCorrect) VALUES (?, ?, ?); SELECT LAST_INSERT_ID();', [req.body.text, req.body.questionID, req.body.isCorrect]);
        const newAnswer = await maria.query('SELECT * FROM answers WHERE id = ?', firstQuery[1][0]["LAST_INSERT_ID()"]);
        res.send(newAnswer);  
    });

    //update answer
    app.put('/api/answers/:id', async (req, res) => {
        const answer = await maria.query('SELECT * FROM answers WHERE id = ?', req.params.id);
        if(answer.length === 0){
            res.status(404).send(`answer with id ${req.params.id} not found`);
            return;
        }
           
        const sanitizeResult = joi.validate(req.body, schemaAnswer);
        if(sanitizeResult.error){
            res.status(400).send(sanitizeResult.error.details[0].message);
            return;
        }
    
        const firstQuery = await maria.query('UPDATE answers SET text = ?, questionID = ?, isCorrect = ? WHERE id = ?', [req.body.text, req.body.questionID, req.body.isCorrect, req.params.id]);
        const updatedAnswer = await maria.query('SELECT * FROM answers WHERE id = ?', [req.params.id]);

        res.send(updatedAnswer);
    });

    //delete answer
    app.delete('/api/answers/:id', async (req, res) => {
        const deletedAnswer = await maria.query('SELECT * FROM answers WHERE id = ?', [req.params.id]);
        if(deletedAnswer.length === 0){
            res.status(404).send(`answer with id ${req.params.id} not found`);
            return;
        }
        await maria.query('DELETE FROM answers WHERE id = ?',[req.params.id]);
        res.send(deletedAnswer);
    });
}  