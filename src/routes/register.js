const mongoose = require('mongoose');
const users = mongoose.model('User');

module.exports = function(app, db) {
    app.post('/api/register', (req, res) => {
        if (req.body.email && req.body.password) {
            users.create({
                email: req.body.email,
                password: req.body.password,
                isAdmin: false,
                schedule: null,
            })
            res.send("OK")
        } else {
            res.status(400).send({error: "Bad request"})
        }
    });
};