const mongoose = require('mongoose');
const tokens = mongoose.model('RefreshToken');
const jwt = require('jsonwebtoken');
const secretKey = require('./env');

async function refreshToken(req){
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
        throw new Error("Token not found")
    }
}