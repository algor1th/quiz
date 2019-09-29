'use strict';

const authenticatedUsers = {};
const request = require('request');
const userServerURL = process.env.USERSERVER;

module.exports = {
    checkUsername: async function(token, name){
        if(token in authenticatedUsers && checkAuthTime(token)){
            if(authenticatedUsers[token]["name"] === name){
                return true;
            }else{
                await refreshToken(token);
                return authenticatedUsers[token]["name"] === name;
            }
        }else{
            await refreshToken(token);
            if(token in authenticatedUsers)
                return authenticatedUsers[token]["name"] === name;
            return false;
        }        
    },
    checkUserID: async function(token, id){
        if(token in authenticatedUsers  && checkAuthTime(token)){
            if(authenticatedUsers[token]["userID"] === id){
                return true;
            }else{
                await refreshToken(token);
                return authenticatedUsers[token]["userID"] === id;
            }
        }else{
            await refreshToken(token);
            if(token in authenticatedUsers)
                return authenticatedUsers[token]["userID"] === id;
            return false;
        }        
    },
    getUserName: async function(token){
        if(token in authenticatedUsers  && checkAuthTime(token)){
           return authenticatedUsers[token]["name"];
        }else{
            await refreshToken(token);
            if(token in authenticatedUsers)
                return authenticatedUsers[token]["name"];
            return null;
        }      
    },
    getUserID: async function(token){
        if(token in authenticatedUsers  && checkAuthTime(token)){
           return authenticatedUsers[token]["userID"];
        }else{
            await refreshToken(token);
            if(token in authenticatedUsers)
                return authenticatedUsers[token]["userID"];
            return null;
        }      
    },
    getUserLevel: async function(casterToken, userID){
        if(await this.isAuthenticated(casterToken)){
            if(userID in authenticatedUsers){
                return authenticatedUsers[userID]['level'];
            }else{
                await cacheUserByID(casterToken, userID);
                if(userID in authenticatedUsers)
                    return authenticatedUsers[userID]['level'];
            }
        }  
        return null;  
    },
    getUserScore: async function(casterToken, userID){
        if(await this.isAuthenticated(casterToken)){
            if(userID in authenticatedUsers){
                return authenticatedUsers[userID]['score'];
            }else{
                await cacheUserByID(casterToken, userID);
                if(userID in authenticatedUsers)
                    return authenticatedUsers[userID]['score'];
            }
        }  
        return null;  
    },
    getUserByID: async function(casterToken, userID){
        if(await this.isAuthenticated(casterToken)){
            if(userID in authenticatedUsers){
                return authenticatedUsers[userID];
            }else{
                await cacheUserByID(casterToken, userID);
                if(userID in authenticatedUsers){
                    return authenticatedUsers[userID];
                }
            }
        }  
        return null;  
    },
    isAuthenticated: async function(token){
        if(token in authenticatedUsers  && checkAuthTime(token)){
            return true;
        }else{
            await refreshToken(token);
            return token in authenticatedUsers;
        }      
    },
    isAdmin: async function(token){
        const userID = await module.exports.getUserID(token);
        return userID ==  process.env.ADMINUSER;
    },
    authenticatedUsers: authenticatedUsers,
} 

function refreshToken(token){
    return new Promise(function (resolve, reject) {
        request(userServerURL + '/api/authentication/'+token, { json: true }, (err, res, body) => {
            if(res.statusCode !== 401){
                var newUser = {};
                newUser["name"] = body.name;
                newUser["score"] = body.score;
                newUser["userID"] = body.id;
                newUser["level"] = body.level;
                newUser["authTime"] = body.authTime;
                authenticatedUsers[token] = newUser; 
                authenticatedUsers[body.id] = newUser; 
            }                
            resolve();
        });
    });
}

function cacheUserByID(casterToken, ID){
    return new Promise(function (resolve, reject) {
        request(userServerURL +'/api/users/'+ID, {
            headers:{
                'content-type': 'application/json',
                'authentication': casterToken,
            },
            json: true}, (err, res, body) => {
                if(res.statusCode !== 404){
                    var newUser = {};
                    newUser["name"] = body.name;
                    newUser["score"] = body.score;
                    newUser["userID"] = body.id;
                    newUser["level"] = body.level;
                    authenticatedUsers[body.id] = newUser; 
                }
                resolve();                
            });
    });
}

function checkAuthTime(token){
    var dt = new Date();
    return token['authTime']+ process.env.TOKENDECAYTIME > dt.getTime();
}