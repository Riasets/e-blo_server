const mongoose              = require('mongoose');
const users                 = mongoose.model('User');
const schedules             = mongoose.model('UserSchedule');
const tokens                = mongoose.model('RefreshToken');
const jwt                   = require('jsonwebtoken');
const crypto                = require('crypto');
const { validationResult }  = require('express-validator/check');

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
            throw {
                message: "User not found",
                status: 404,
            };
        }

        const schedule = schedules.findOne({
            owner: user._id,
        })
            .exec();

        if (!schedule) {
            throw {
                status: 404,
                message: "Schedule not found",
            }
        }

        const token =  jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
            schedule: schedule._id,
            importSchedule: user.importSchedule,
            importEvents: user.importEvents,
        }, process.env.SECRET_KEY);

        const refreshToken = {
            token: jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin,
                schedule: schedule._id,
                importSchedule: user.importSchedule,
                importEvents: user.importEvents
                },
                process.env.SECRET_KEY,
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
        return res.status(error.status ? error.status : 500).send({ error: error.message });
    }
};