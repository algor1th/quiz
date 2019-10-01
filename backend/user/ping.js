'use strict';

const authentication = require('./authentication.js');

module.exports = function(app){
    
    //create a token for a user
    app.get('/api/ping', async (req, res) => {
        
        const token = req.get("authentication");
        var isAuthorized = await authentication.isAdmin(token);
        if(isAuthorized){
            res.send("pong admin");
            return;
        }
        res.send("pong");
    });
}  