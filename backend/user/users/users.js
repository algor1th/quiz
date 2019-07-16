'use strict';

const maria = require('../maria.js');
const joi = require('@hapi/joi');

const schemaUser = {
    name: joi.string().min(3).required(),
    score: joi.number().required()
}

module.exports = function(app){
    
    //get users
    app.get('/api/users', async (req, res) => {
        var users;
        if(req.query.sortBy){
            switch(req.query.sortBy){
                case 'name':
                        users = await maria.query('SELECT * FROM users ORDER BY name ASC');
                    break;
                case 'id':
                        users = await maria.query('SELECT * FROM users ORDER BY id ASC');
                    break;
                case 'score':
                        users = await maria.query('SELECT * FROM users ORDER BY score DESC');
                    break;
            }
        }else{
            users = await maria.query('SELECT * FROM users');
        }
        res.send(users);   
    });

    //get specific user
    app.get('/api/users/:id', async (req, res) => {
        const user = await maria.query('SELECT * FROM users WHERE id = ?', req.params.id);
        if(user.length === 0){
            res.status(404).send(`user with id ${req.params.id} not found`);
            return;
        }
        res.send(user);    
    });

    //add user
    app.post('/api/users', async (req, res) => {
      
        const sanitizeResult = joi.validate(req.body, schemaUser);
        if(sanitizeResult.error){
            res.status(400).send(sanitizeResult.error.details[0].message);
            return;
        }

        const firstQuery = await maria.query('INSERT INTO users (name,score) VALUES (?, ?); SELECT LAST_INSERT_ID();', [req.body.name,req.body.score]);
        const newUser = await maria.query('SELECT * FROM users WHERE id = ?', firstQuery[1][0]["LAST_INSERT_ID()"]);
        res.send(newUser);  
    });

    //update user
    app.put('/api/users/:id', async (req, res) => {
        const user = await maria.query('SELECT * FROM users WHERE id = ?', req.params.id);
        if(user.length === 0){
            res.status(404).send(`user with id ${req.params.id} not found`);
            return;
        }
           
        const sanitizeResult = joi.validate(req.body, schemaUser);
        if(sanitizeResult.error){
            res.status(400).send(sanitizeResult.error.details[0].message);
            return;
        }
    
        const firstQuery = await maria.query('UPDATE users SET name = ?, score = ? WHERE id = ?', [req.body.name,req.body.score, req.params.id]);
        const updatedUser = await maria.query('SELECT * FROM users WHERE id = ?', [req.params.id]);

        res.send(updatedUser);
    });

    //delete user
    app.delete('/api/users/:id', async (req, res) => {
        const deletedUser = await maria.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if(deletedUser.length === 0){
            res.status(404).send(`user with id ${req.params.id} not found`);
            return;
        }
        await maria.query('DELETE FROM users WHERE id = ?',[req.params.id]);
        res.send(deletedUser);
    });
}  