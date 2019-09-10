'use strict';

const authenticatedUsers = {};
const request = require('request');
const userServerURL = process.env.USERSERVER;

module.exports = {
    checkUsername: async function(token, name){
        if(token in authenticatedUsers){
            if(authenticatedUsers[token]["name"] === name){
                return true;
            }else{
                await refreshToken(token);
                return authenticatedUsers[token]["name"] === name;
            }
        }else{
            await refreshToken(token);
            if(token in authenticatedUsers)
                return false;
            return authenticatedUsers[token]["name"] === name;
        }        
    },
    checkUserID: async function(token, id){
        if(token in authenticatedUsers){
            if(authenticatedUsers[token]["userID"] === id){
                return true;
            }else{
                await refreshToken(token);
                return authenticatedUsers[token]["userID"] === id;
            }
        }else{
            await refreshToken(token);
            if(token in authenticatedUsers)
                return false;
            return authenticatedUsers[token]["userID"] === id;
        }        
    },
    getUserName: async function(token){
        if(token in authenticatedUsers){
           return authenticatedUsers[token]["name"];
        }else{
            await refreshToken(token);
            if(token in authenticatedUsers)
                return authenticatedUsers[token]["name"];
            return null;
        }      
    },
    getUserID: async function(token){
        if(token in authenticatedUsers){
           return authenticatedUsers[token]["userID"];
        }else{
            await refreshToken(token);
            if(token in authenticatedUsers)
                return authenticatedUsers[token]["userID"];
            return null;
        }      
    },
    getUserLevel: async function(userID){
        if(userID in authenticatedUsers){
           return authenticatedUsers[userID]['level'];
        }else{
            return 5;
        }      
    },
    isAuthenticated: async function(token){
        if(token in authenticatedUsers){
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
                newUser["userID"] = body.id;
                newUser["level"] = body.level;
                authenticatedUsers[token] = newUser; 
                authenticatedUsers[body.id] = newUser; 
            }                
            resolve();
        });
    });
}