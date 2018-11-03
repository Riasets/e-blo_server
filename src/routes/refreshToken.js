const mongoose = require('mongoose');
const users = mongoose.model('User');
const tokens = mongoose.model('RefreshToken');
const jwt = require('jsonwebtoken');
const secretKey = require('./env');

module.exports = function (app, db) {
    app.get('/api/refresh', (req, res) => {
        if (req.headers.token){
            jwt.verify(req.headers.token, secretKey)
                .then((decode) => {
                    if (tokens.findOneAndDelete(req.headers.token)){
                        return {refreshToken: jwt.sign(decode, secretKey, {expires_in: "2d"}),
                            token: jwt.sign(decode, secretKey)}
                    } else {
                        throw new Error("Token is not exist")
                    }
                })
                .then((tokens)=>{
                    
                })

                .catch((err)=>{
                    res.status(401).send({error: err});
                })
        } else {
            res.status(403).send({error: "Token not found"});
        }
    })
};