'use strict';

const authentication = require('../authentication.js');
const maria = require('../maria.js');
const joi = require('@hapi/joi');

const schemaCategory = {
    name: joi.string().min(3).required().max(1024),
}

module.exports = function(app){
    
    //get all categories
    app.get('/api/categories', async (req, res) => {
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAdmin(token);
        if(!isAuthorized){
            res.status(401).send("You did not provide an authorized admin token with your request")
            return;
        }

        var categories = await maria.query('SELECT * FROM categories');

        res.send(categories);    
    });

    //get specific category
    app.get('/api/categories/:id', async (req, res) => {
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAuthenticated(token);
        if(!isAuthorized){
            res.status(401).send("You did not provide an authorized token with your request")
            return;
        }

        const categories = await maria.query('SELECT * FROM categories WHERE id = ?', req.params.id);
       
        if(categories.length === 0){
            res.status(404).send(`category with id ${req.params.id} not found`);
            return;
        }
                
        res.send(categories[0]);    
    });

    //add category
    app.post('/api/categories', async (req, res) => {
      
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAdmin(token);
        if(!isAuthorized){
            res.status(401).send("You did not provide an authorized admin token with your request")
            return;
        }

        const sanitizeResult = joi.validate(req.body, schemaCategory);
        if(sanitizeResult.error){
            res.status(400).send(sanitizeResult.error.details[0].message);
            return;
        }

        const firstQuery = await maria.query('INSERT INTO categories (name) VALUES (?); SELECT LAST_INSERT_ID();', [req.body.name]);
        const newCategory = await maria.query('SELECT * FROM categories WHERE id = ?', firstQuery[1][0]["LAST_INSERT_ID()"]);
        res.send(newCategory[0]);  
    });

    //update category
    app.put('/api/categories/:id', async (req, res) => {        
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAdmin(token);
        if(!isAuthorized){
            res.status(401).send("You did not provide an authorized admin token with your request")
            return;
        }
        
        const question = await maria.query('SELECT * FROM categories WHERE id = ?', req.params.id);
        if(question.length === 0){
            res.status(404).send(`category with id ${req.params.id} not found`);
            return;
        }
           
        const sanitizeResult = joi.validate(req.body, schemaCategory);
        if(sanitizeResult.error){
            res.status(400).send(sanitizeResult.error.details[0].message);
            return;
        }
    
        const firstQuery = await maria.query('UPDATE categories SET name = ? WHERE id = ?', [req.body.name, req.params.id]);
        const updatedCategory = await maria.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);

        res.send(updatedCategory[0]);
    });

    //delete category
    app.delete('/api/categories/:id', async (req, res) => {
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAdmin(token);
        if(!isAuthorized){
            res.status(401).send("You did not provide an authorized admin token with your request")
            return;
        }
        
        const deletedCategory = await maria.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
        if(deletedQuestion.length === 0){
            res.status(404).send(`category with id ${req.params.id} not found`);
            return;
        }
        await maria.query('DELETE FROM categories WHERE id = ?',[req.params.id]);
        res.send(deletedCategory[0]);
    });
}  