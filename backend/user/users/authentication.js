'use strict';

const request = require('request');
const maria = require('../maria.js');
const joi = require('@hapi/joi');
const rand = require('csprng');

const schemaUserID = {
    userID: joi.number().required()
}

const gameServerURL = process.env.GAMESERVER;


module.exports = function(app){
    
    //create a token for a user
    app.post('/api/authentication', async (req, res) => {

        const sanitizeResult = joi.validate(req.body, schemaUserID);
        if(sanitizeResult.error){
            res.status(400).send(sanitizeResult.error.details[0].message);
            return;
        }

        const user = await maria.query('SELECT * FROM users WHERE id = ?', [req.body.userID]);
        if(user.length === 0){
            res.status(404).send(`user with id ${req.body.userID} not found`);
            return;
        }
        if(user[0]["token"] !== null){
            res.status(404).send(`user with id ${req.body.userID} already authenticated`);
            return;
        }

        const token = rand(180, 36)+"_"+req.body.userID;

        const firstQuery = await maria.query('UPDATE users SET token = ? WHERE id = ?', [token, req.body.userID]);
        const updatedUser = await maria.query('SELECT * FROM users WHERE id = ?', [req.body.userID]);

        res.send(updatedUser[0]);
    });

    //revoke a token for a user
    app.delete('/api/authentication/:id', async (req, res) => {
        const user = await maria.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if(user.length === 0){
            res.status(404).send(`user with id ${req.params.id} not found`);
            return;
        }

        const firstQuery = await maria.query('UPDATE users SET token = null WHERE id = ?', [req.params.id]);
        const updatedUser = await maria.query('SELECT * FROM users WHERE id = ?', [req.params.id]);

        request.delete(gameServerURL + '/api/authentication/'+user["token"], { json: true }, (err, res, body) => {});

        res.send(updatedUser[0]);
    });

    //get user with specific token
    app.get('/api/authentication/:token', async (req, res) => {
        const user = await maria.query('SELECT * FROM users WHERE token = ?', [req.params.token]);
        if(user.length === 0){
            res.status(404).send(`user with token ${req.params.token} not found`);
            return;
        }
       
        res.send(user[0]);
    });
}  