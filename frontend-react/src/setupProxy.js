const proxy = require('http-proxy-middleware');
const userServer = 'http://localhost:3000';
module.exports = function(app) {
    app.use(proxy('/api/users', {target: userServer}));
    app.use(proxy('/api/authentication', {target: userServer}));
}