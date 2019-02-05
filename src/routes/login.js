const { header } = require('express-validator/check');
const { login } = require('../controllers/login');

module.exports = function(app, db) {
    app.get('/api/login',
        header('login').isString().withMessage('Empty login field'),
        header('password').isString().withMessage('Empty password field'),
        login);
};