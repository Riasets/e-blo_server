const mongoose = require('mongoose');
const schedules = mongoose.model('UserSchedule');
const jwt = require('jsonwebtoken');
const secretKey = require('./env');

module.exports = function (app,db) {
    app.get('api/schedule',(req, res)=>{
        try{
            var decoded = verify(req.headers.token, secretKey);
            schedules.findOne({_id: decoded.schedule})
                .exec((err, schedule) =>{
                    if (schedule.owner === decoded.id) {
                        if (!schedule) {
                            res.status(200).send({schedule: []});
                        } else {
                            res.send({schedule: schedule.events});
                        }
                    } else {
                        res.status(401).send({error: "You haven't permissions for this schedule"});
                    }
                }
            )
        } catch(err) {
            res.send(400).send({error: "Wrong token"});
        }
    });
    app.post('api/schedule', (req, res)=>{
        try {
            var decoded = verify(req.headers.token, secretKey);
            schedules.findOne({_id: decoded.schedule})
                .exec((err, schedule)=>{
                    if (schedule.owner === decoded.id) {
                        if (!schedule) {
                            res.status(200).send({schedule: []});
                        } else {
                            var newEvents = schedule.events;
                            newEvents.append({start: req.body.start, end: req.body.end, name: req.body.name, description: req.body.description, numberOfLesson: req.body.numberOfLesson, repeat: req.body.repeat, day: req.body.day})
                            if (req.body.name && req.body.start && req.body.end && req.body.repeat) {
                                schedules.save({_id : decoded.schedule, events: newEvents})
                                    .exec((err, answer) => {
                                        if (error){
                                            res.status(500).send({error: "Database error", message: error});
                                        } else {
                                            res.send({status: "OK"});
                                        }
                                    })
                            }
                        }
                    } else {
                        res.status(401).send({error: "You haven't permissions for this schedule"});
                    }
                })
        } catch (err) {
            res.send(400).send({error: "Wrong token"});
        }
    })

}