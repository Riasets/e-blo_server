const mongoose = require('mongoose');
const tokens = mongoose.model('RefreshToken');
const jwt = require('jsonwebtoken');
const secretKey = require('../routes/env');
const { validationResult } = require('express-validator/check');

async function refreshToken(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0] });
    }

   const decode = jwt.verify(req.headers.token, secretKey);
   const refreshToken = await checkToken(req.headers.token, decode)
       .catch((error)=>{
           res.status(401).send({error})
       });
   const newToken = jwt.sign({
       id: decode.id,
       isAdmin: decode.isAdmin,
       schedule: decode.schedule}, secretKey);
   res.send({token: newToken, refreshToken})
}

async function checkToken(token, decode){
        if (tokens.findOneAndDelete({token})) {
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