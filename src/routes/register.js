const { check }         = require('express-validator/check');
const { register }      = require('../controllers/register');

module.exports = function(app, db) {
    app.post('/api/register',
        check('email').isString().withMessage('Empty email field')
            .matches(/@/).withMessage('Not correct email'),
        check('password').isString().withMessage('Empty password field')
            .isLength({ min: 5 }).withMessage('Password must contain at least 5 chars'),
        register
    )
};