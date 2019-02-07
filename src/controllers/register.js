const mongoose               = require('mongoose');
const users                  = mongoose.model('User');
const schedules              = mongoose.model('UserSchedule');
const crypto                 = require('crypto');
const { validationResult }   = require('express-validator/check');

module.exports.register = async function(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()});
    }

    try {

        const user = await users.find({ email: req.body.email })
            .exec()

        if (user.length) {
            throw {
                status: 400,
                message: "User with this email already exist",
            }
        }

        const newUser = {
            email: req.body.email,
            password: crypto.createHash('md5').update(req.body.password).digest('hex'),
            isAdmin: false,
            importSchedule: null,
            importEvents: [],
        }

        const userDB = await users.create(newUser);

        await schedules.create({
            copy: false,
            owner: userDB._id
        });

        res.send("OK");

    } catch (error) {
        return res.status(error.status ? error.status : 500).send({ error: error.message });
    }
};