'use strict';

const maria = require('./maria.js');

module.exports = {
    getUser: async function(token){
       const user = await queryGetUser(token);
       return user;
    },
    isAuthenticated: async function(token){
        const user = await queryGetUser(token);
        return user != null;

    },
    isAdmin: async function(token){
        if(process.env.ADMINUSER == 0)
            return true;
        const user = await queryGetUser(token);
        if(user != null)
            return user["id"] ==  process.env.ADMINUSER;
        return false;
    }
}

async function queryGetUser(token){
    const user = await maria.query('SELECT * FROM users WHERE token = ?', [token]);
    var dt = new Date();
    if(user.length === 0 || !token['authTime'] || token['authTime']+ process.env.TOKENDECAYTIME <dt.getTime()){
        return null;
    }
    return user[0];
}