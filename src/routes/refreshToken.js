const refreshToken = require('../controllers/refreshToken');
const { header, validationResult } = require('express-validator/check');

module.exports = function (app, db) {
    app.get('/api/refresh',
        header('token').isString().withMessage('Empty token field'),
        refreshToken)
};