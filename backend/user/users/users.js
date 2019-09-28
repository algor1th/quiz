'use strict';

const maria = require('../maria.js');
const authentication = require('../authentication.js');

const joi = require('@hapi/joi');

const schemaUser = {
    name: joi.string().min(3).required(),
    score: joi.number().required(),
    level: joi.number().required()
}

module.exports = function(app){
    
    //get users
    app.get('/api/users', async (req, res) => {
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAuthenticated(token);
        if(!isAuthorized){
            res.status(401).send("You did not provide a valid authorized token with your request")
            return;
        }
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
                case 'level':
                        users = await maria.query('SELECT * FROM users ORDER BY level DESC');
                    break;
            }
        }else{
            users = await maria.query('SELECT * FROM users');
        }
        
        var output = []
        var i2 = 0;
        for (var i = 0; i < users.length; i++) { 
            var user = {}
            if(users[i]['id'] == process.env.ADMINUSER){
                continue;
            }
            user["id"] = users[i]["id"];
            user["name"] = users[i]["name"];
            user["score"] = users[i]["score"];
            user["level"] = users[i]["level"];
            output[i2] = user;
            i2++;
        }

        res.send(output);   
    });

    //get specific user
    app.get('/api/users/:id', async (req, res) => {
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAuthenticated(token);
        if(!isAuthorized){
            res.status(401).send("You did not provide a valid authorized token with your request")
            return;
        }
        const user = await maria.query('SELECT * FROM users WHERE id = ?', req.params.id);
        if(user.length === 0){
            res.status(404).send(`user with id ${req.params.id} not found`);
            return;
        }
        var newUser = {}
        newUser["id"] = user[0]["id"];
        newUser["name"] = user[0]["name"];
        newUser["score"] = user[0]["score"];
        newUser["level"] = user[0]["level"];
        res.send(newUser);    
    });

    //add user
    app.post('/api/users', async (req, res) => {
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAdmin(token);
        if(!isAuthorized){
            res.status(401).send("You did not provide an authorized admin token with your request")
            return
        }
        const sanitizeResult = joi.validate(req.body, schemaUser);
        if(sanitizeResult.error){
            res.status(400).send(sanitizeResult.error.details[0].message);
            return;
        }

        const firstQuery = await maria.query('INSERT INTO users (name,score,level) VALUES (?, ?, ?); SELECT LAST_INSERT_ID();', [req.body.name,req.body.score, req.body.level]);
        const newUser = await maria.query('SELECT * FROM users WHERE id = ?', firstQuery[1][0]["LAST_INSERT_ID()"]);
        
        var newUserOutput = {}
        newUserOutput["id"] = newUser[0]["id"];
        newUserOutput["name"] = newUser[0]["name"];
        newUserOutput["score"] = newUser[0]["score"];
        newUserOutput["level"] = newUser[0]["level"];

        res.send(newUserOutput);    
    });

    //update user
    app.put('/api/users/:id', async (req, res) => {
        const token = req.get("authentication");
        var isAdmin = await authentication.isAdmin(token)
        var uTemp = await authentication.getUser(token)
        var isAuth = isAdmin || (uTemp != null && uTemp["id"] == req.params.id )
        if(!isAuth){
            res.status(401).send("You did not provide an authorized token for the user or an admin token with your request")
            return;
        }
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
    
        const firstQuery = await maria.query('UPDATE users SET name = ?, score = ?, level = ? WHERE id = ?', [req.body.name,req.body.score, req.body.level, req.params.id]);
        const updatedUser = await maria.query('SELECT * FROM users WHERE id = ?', [req.params.id]);

        var newUserOutput = {}
        newUserOutput["id"] = updatedUser[0]["id"];
        newUserOutput["name"] = updatedUser[0]["name"];
        newUserOutput["score"] = updatedUser[0]["score"];
        newUserOutput["level"] = updatedUser[0]["level"];

        res.send(newUserOutput);    
    });

    //delete user
    app.delete('/api/users/:id', async (req, res) => {
        const token = req.get("authentication");
        var isAdmin = await authentication.isAdmin(token)
        var uTemp = await authentication.getUser(token)
        var isAuth = isAdmin || (uTemp != null && uTemp["id"] == req.params.id )
        if(!isAuth){
            res.status(401).send("You did not provide an authorized token for the user or an admin token with your request")
            return;
        }
        
        const deletedUser = await maria.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if(deletedUser.length === 0){
            res.status(404).send(`user with id ${req.params.id} not found`);
            return;
        }
        await maria.query('DELETE FROM users WHERE id = ?',[req.params.id]);
       
        var newUserOutput = {}
        newUserOutput["id"] = deletedUser[0]["id"];
        newUserOutput["name"] = deletedUser[0]["name"];
        newUserOutput["score"] = deletedUser[0]["score"];
        newUserOutput["level"] = deletedUser[0]["level"];
        res.send(newUserOutput);   
    });
}  