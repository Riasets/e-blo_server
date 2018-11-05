const mongoose = require('mongoose');
const tokens = mongoose.model('RefreshToken');
const jwt = require('jsonwebtoken');
const secretKey = require('../env');

async function refreshToken(token){
   const decode = jwt.verify(token, secretKey);
   const refreshToken = await checkToken(token, decode);
   const newToken = jwt.sign({
       id: decode.id,
       isAdmin: decode.isAdmin,
       schedule: decode.schedule}, secretKey);
   return {newToken, refreshToken}
}
// TODO error handlers 
async function checkToken(token, decode){
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
}

module.exports = refreshToken;