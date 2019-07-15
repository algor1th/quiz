'use strict';

const maria = require('../maria.js');
const joi = require('@hapi/joi');

const rand = require('csprng');

const schemaUserID = {
    id: joi.number().required()
}

module.exports = function(app){
    
    //create a token for a user
    app.post('/api/authentication', async (req, res) => {
 
            console.log(rand(128, 16));
    });

    //revoke a token for a user
    app.delete('/api/authentication/:id', async (req, res) => {

    });
}  