const mongoose = require('mongoose');
const users = mongoose.model('User');
const schedules = mongoose.model('UserSchedule');
const tokens = mongoose.model('RefreshToken');
const jwt = require('jsonwebtoken');
const secretKey = require('../routes/env');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');

module.exports.login = async function(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()});
    }

    try {

        const user = await users.findOne({
            email: req.headers.email,
            password: crypto.createHash('md5')
                .update(req.headers.password)
                .digest('hex'),
        })
            .exec();

        if (!user) {
            throw Error("User not found");
        }

        const schedule = schedules.findOne({
            owner: user._id,
        })
            .exec();

        if (!schedule) {
            throw Error("Schedule not found")
        }

        const token =  jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
            schedule: schedule._id,
            importSchedule: user.importSchedule,
            importEvents: user.importEvents,
        }, secretKey);

        const refreshToken = {
            token: jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin,
                schedule: schedule._id,
                importSchedule: user.importSchedule,
                importEvents: user.importEvents
                },
                secretKey,
                { expiresIn: "2d" }
            )};

        await tokens.create(refreshToken);

        res.send({
            token,
            refreshToken,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });

    } catch(error){
        return res.send({error});
    }
};