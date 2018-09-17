const login = require('./login');
const register = require('./register');
const schedule = require('./schedule');
module.exports = function(app, db) {
    login(app,db);
    register(app,db);
    schedule(app,db);
};