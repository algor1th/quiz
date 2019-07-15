'use strict';

const authentication = require('./authentication.js');
const joi = require('@hapi/joi');

const schemaAuthenticate = {
    userID: joi.number().required(),
    name: joi.string().min(3).required().max(100),
    token: joi.string().min(3).required().max(100)
}

module.exports = function(app){
    app.delete('/api/authenticate/:token', async (req, res) => {

        if(authentication.authenticatedUsers[req.params.token] === null){
            res.status(400).send(`user with token ${req.params.token} not cached`);
        }

        delete authentication.authenticatedUsers[req.params.token];                        
        res.send("Revoked cached token successfully");    
    });
}
