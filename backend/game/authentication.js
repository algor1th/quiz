'use strict';

const authenticatedUsers = {};
const request = require('request');
const userServerURL = process.env.USERSERVER;

module.exports = {
    checkUsername: async function(token, name){
        if(authenticatedUsers[token] !== null){
            if(authenticatedUsers[token]["name"] === name){
                return true;
            }else{
                await refreshToken(token);
                return authenticatedUsers[token]["name"] === name;
            }
        }else{
            await refreshToken(token);
            if(authenticatedUsers[token] === null)
                return false;
            return authenticatedUsers[token]["name"] === name;
        }        
    },
    checkUserID: async function(token, id){
        if(authenticatedUsers[token] !== null){
            if(authenticatedUsers[token]["userID"] === id){
                return true;
            }else{
                await refreshToken(token);
                return authenticatedUsers[token]["userID"] === id;
            }
        }else{
            await refreshToken(token);
            if(authenticatedUsers[token] === null)
                return false;
            return authenticatedUsers[token]["userID"] === id;
        }        
    },
    getUserName: async function(token){
        if(authenticatedUsers[token] !== null){
           return authenticatedUsers[token]["name"];
        }else{
            await refreshToken(token);
            if(authenticatedUsers[token] === null)
                return null;
            return authenticatedUsers[token]["name"];
        }      
    },
    getUserID: async function(token){
        if(authenticatedUsers[token] !== null){
           return authenticatedUsers[token]["userID"];
        }else{
            await refreshToken(token);
            if(authenticatedUsers[token] === null)
                return null;
            return authenticatedUsers[token]["userID"];
        }      
    }
}

async function refreshToken(token){
    /*
    request('userServerURL/api/users', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body.url);
    console.log(body.explanation);
  });
    app.post('/api/authenticate', async (req, res) => {

        const sanitizeResult = joi.validate(req.body, schemaAuthenticate);
        if(sanitizeResult.error){
            res.status(400).send(sanitizeResult.error.details[0].message);
            return;
        }
        entry = {}
        entry["userID"] = req.body.userID;
        entry["name"] = req.body.name;
        authentication.authenticatedUsers[req.body.token] = entry;

        res.send("Added user successfully");    
    }),*/
    //TODO CALL GET OF OTHER API TO GET USER AND STORE IT 
}