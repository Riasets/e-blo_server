const mongoose = require('mongoose');
const tokens = mongoose.model('RefreshToken');
const jwt = require('jsonwebtoken');
const secretKey = require('../env');

async function refreshToken(req){
    if (req.headers.token){
        try {
            const decode = jwt.verify(req.headers.token, secretKey);
            const refreshToken = await checkToken(req.headers.token, decode);
            const token = jwt.sign({
                    id: decode.id,
                    isAdmin: decode.isAdmin,
                    schedule: decode.schedule}, secretKey);
            return {token, refreshToken}
        } catch(err) {
                console.log(err);
                throw new Error(err)
        }
    } else {
        throw new Error("Token not found")
    }
}

async function checkToken(token, decode){
    try {
        if (tokens.findOneAndDelete(token)) {
            const token = await tokens.create({
                token: jwt.sign({
                        id: decode.id,
                        isAdmin: decode.isAdmin,
                        schedule: decode.schedule
                    },
                    secretKey, {expiresIn: '2 days'})
            });
            return token.token
        } else {
            throw new Error('Token is not exist');
        }

    } catch(err){
            throw new Error(err)
    }

}

module.exports = refreshToken;