const mongoose = require('mongoose');
const users = mongoose.model('User');

module.exports = function(app, db) {
    app.post('/api/register', (req, res) => {
        console.log(req.body);
        users.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isAdmin: false,
            schedule: null,
            })
        res.send("OK")
    });
};