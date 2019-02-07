const refreshToken  = require('../controllers/refreshToken');
const { header }    = require('express-validator/check');

module.exports = function (app, db) {
    app.get('/api/refresh',
        header('token').isString().withMessage('Empty token field'),
        refreshToken)
};