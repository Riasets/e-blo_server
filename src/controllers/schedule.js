const mongoose = require('mongoose');
const events = mongoose.model('Event');
const jwt = require('jsonwebtoken');
const secretKey = require('../routes/env');
const { validationResult } = require('express-validator/check');


async function getSchedule(req, res){

    let decoded;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0] });
    }

    try {
        decoded = jwt.verify(req.headers.token, secretKey)
    }catch(error){
        return res.status(401).send({error})
    }

    try {
        const schedule = await events.find({$or: [{owner: {$in: [decoded.schedule, decoded.importSchedule]}}, {_id: {$in: decoded.importEvents}}]}).exec();
        return res.send({events: schedule, scheduleId: decoded.schedule})
    } catch(error){
        return res.status(500).send({error})
    }
}

module.exports = getSchedule;