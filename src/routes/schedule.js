const mongoose = require('mongoose');
const { header, check } = require('express-validator/check');
const { getSchedule, postEvent } = require('../controllers/schedule');

module.exports = function (app,db) {
    app.get('/api/schedule',
        header('token').isString().withMessage('Empty token field'),
        getSchedule);

    app.post('/api/event',
        header('token').isString().withMessage('Empty token field'),
        check('name').isString().withMessage('Empty name field'),
        check('repeat').isNumeric().withMessage('Empty repeat field'),
        check('start').isNumeric().withMessage('Empty start field'),
        check('end').isNumeric().withMessage('Empty end field'),
        check('day').isString().withMessage('Empty day field'),
        postEvent);
};