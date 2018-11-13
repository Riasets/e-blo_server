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

    function verify(){
        return jwt.verify(req.headers.token, secretKey);
    }



   try {
       const decode = verify();
       if (tokens.findOneAndDelete({token: req.headers.token})) {
          const newRefreshToken = await tokens.create({
               token: jwt.sign({
                       id: decode.id,
                       isAdmin: decode.isAdmin,
                       schedule: decode.schedule
                   },
                   secretKey, {expiresIn: '2 days'})
           });

          const newToken = jwt.sign({
               id: decode.id,
               isAdmin: decode.isAdmin,
               schedule: decode.schedule}, secretKey);

          return res.send({token: newToken, refreshToken: newRefreshToken.token})
       } else {
           throw new Error('Token is not exist');
       }
   } catch (error) {
        console.log(error)
       return res.status(401).send({error});
   }
}


module.exports = refreshToken;