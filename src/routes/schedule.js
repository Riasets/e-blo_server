const mongoose = require('mongoose');
const events = mongoose.model('Event');
const jwt = require('jsonwebtoken');
const secretKey = require('./env');
const { header } = require('express-validator/check');
const { getSchedule } = require('../controllers/schedule');

module.exports = function (app,db) {
    app.get('/api/schedule',
        header('token').isString().withMessage('Empty token field'),
        getSchedule);
    app.post('/api/event', (req, res)=>{
            let decoded = jwt.verify(req.headers.token, secretKey, (error, decoded) => {
                if (error){
                    res.status(400).send({error: "Wrong token", message: error});
                }
                if (req.body.name && req.body.repeat && req.body.start && req.body.end && req.body.day && req.body.copy && req.body.isLesson){
                    events.create({
                        name: req.body.name,
                        repeat: req.body.repeat,
                        start: req.body.start,
                        end: req.body.end,
                        day: req.body.day,
                        copy: req.body.copy,
                        numberOfLesson: req.body.numberOfLesson,
                        description: req.body.description,
                        owner: decoded.schedule,
                        isLesson: req.body.isLesson,
                    });
                    res.send({status: "OK"});
                } else {
                    res.status(400).send({error: "Check entered fields"});
                }
            });
    })

};