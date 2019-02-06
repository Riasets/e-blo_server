const mongoose = require('mongoose');
const events = mongoose.model('Event');
const jwt = require('jsonwebtoken');
const secretKey = require('../routes/env');
const { validationResult } = require('express-validator/check');


module.exports.getSchedule = async function(req, res){

    let decoded;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()});
    }

    try {
        decoded = jwt.verify(req.headers.token, secretKey)
    } catch(error) {
        return res.status(401).send({error})
    }

    try {
        const schedule = await events.find({$or:
                [{owner: {$in: [decoded.schedule, decoded.importSchedule]}},
                    {_id: {$in: decoded.importEvents}}]})
            .exec();
        return res.send({events: schedule, scheduleId: decoded.schedule})
    } catch(error) {
        return res.status(500).send({error})
    }
};

module.exports.postEvent = async function(req,res){

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()});
    }

    function verify(){
        return jwt.verify(req.headers.token, secretKey);
    }

    try {
        verify();
    } catch(error){
        res.status(401).send({error});
    }
    try {
        events.create({
            name: req.body.name,
            repeat: req.body.repeat,
            start: req.body.start,
            end: req.body.end,
            day: req.body.day,
            copy: req.body.copy,
            numberOfLesson: req.body.numberOfLesson,
            description: req.body.description,
            owner: verify().schedule,
            isLesson: req.body.isLesson,
        });
        return res.send({status: "OK"});
    } catch (error) {
        return res.status(500).send({error})
    }

};
