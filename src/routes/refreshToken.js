const mongoose = require('mongoose');
const users = mongoose.model('User');
const jwt = require('jsonwebtoken');
const secretKey = require('./env');

module.exports = function (app, db) {
    app.get('/api/refresh', (req, res) => {
        if (req.headers.token){
            jwt.verify(req.headers.token, secretKey, (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        const oldToken = jwt.decode(req.headers.token);
                        res.send({token: jwt.sign(oldToken, secretKey)});
                    } else {
                        send.status(400).send({error: "Wrong token", message: "Refresh token error"});
                    }
                } else {
                    res.send({token: jwt.sign(decoded, secretKey)});
                }
            })
        } else {
            res.status(403).send({error: "Token not found"});
        }
    })
}