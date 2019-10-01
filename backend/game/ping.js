'use strict';

module.exports = function(app){
    app.get('/api/ping', async (req, res) => {
        res.send("pong"); 
    })
}
