const login = require('./login');
const register = require('./register')
module.exports = function(app, db) {
    login(app,db);
    register(app,db);
};