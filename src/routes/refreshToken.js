const mongoose = require('mongoose');
const users = mongoose.model('User');
const tokens = mongoose.model('RefreshToken');
const jwt = require('jsonwebtoken');
const secretKey = require('./env');
const refreshToken = require('./controllers/refreshToken');

module.exports = function (app, db) {
    app.get('/api/refresh', (req, res) => {
        refreshToken(req)
            .then((token)=>{
                console.log(token);
                res.send(token)
            })
            .catch((err)=>{
                res.status(400).send(err)
            })
    })
};