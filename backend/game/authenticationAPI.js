'use strict';

const authentication = require('./authentication.js');
const joi = require('@hapi/joi');

const schemaAuthenticate = {
    userID: joi.number().required(),
    name: joi.string().min(3).required().max(100),
    token: joi.string().min(3).required().max(100)
}

module.exports = function(app){
    app.delete('/api/authentication/:token', async (req, res) => {
        if(req.params.token in authentication.authenticatedUsers){
            var id = authentication.authenticatedUsers[req.params.token]['userID'];                                            
            delete authentication.authenticatedUsers[id];    
            delete authentication.authenticatedUsers[req.params.token];    
            res.send(`revoked token ${req.params.token} successfull`);    
            return; 
        }

        res.status(404).send(`user with token ${req.params.token} not cached`);        
    }),

    app.get('/api/authentication', async (req, res) => {
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAuthenticated(token);
        if(isAuthorized){
            var name = await authentication.getUserName(token);
            res.send(`This request is authenticated. Welcome ${name}!`);  
        }else{
            res.send("this request is not authenticated!");     
        }    
    })
}
