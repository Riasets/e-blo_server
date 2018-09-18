const mongoose = require('mongoose');
const schedules = mongoose.model('UserSchedule');
const events = mongoose.model('Event');
const jwt = require('jsonwebtoken');
const secretKey = require('./env');

module.exports = function (app,db) {
    app.get('api/schedule',(req, res)=>{
        try{
            let allEvents = [];
            let decoded = verify(req.headers.token, secretKey);
            schedules.events.find({$or: [{owner: {$in: [decoded.schedule, decoded.importSchedule]}}, {_id: {$in : decoded.importEvents}}]})
                .exec((err, events) =>{
                    if (err) {
                        res.status(500).send({error: "Database Error", message: err});
                    } else {
                        res.send({events: events, scheduleId: decoded.schedule});
                    }
                }
            )
        } catch(err) {
            res.send(400).send({error: "Wrong token"});
        }
    });
    app.post('api/event', (req, res)=>{
        try {
            let decoded = verify(req.headers.token, secretKey);
            if (req.body.name && req.body.repeat && req.body.start && req.body.end && req.body.day && req.body.copy){
                schedules.events.create({
                    name: req.body.name,
                    repeat: req.body.repeat,
                    start: req.body.start,
                    end: req.body.end,
                    day: req.body.day,
                    copy: req.body.copy,
                    numberOfLesson: req.body.numberOfLesson,
                    description: req.body.description,
                    owner: decoded.schedule,
                })
                res.send({status: "OK"});
            } else {
                res.status(400).send({error: "Check entered fields"});
            }
        } catch (err) {
            res.send(400).send({error: "Wrong token"});
        }
    })

}