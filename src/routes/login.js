const mongoose = require('mongoose');
const users = mongoose.model('User');
const jwt = require('jsonwebtoken');
const secretKey = require('./env');

module.exports = function(app, db) {
    app.get('/api/users', (req, res) => {
        users.find()
            .exec((err, users) =>{
                if (err){
                    res.send("ERROR")
                } else {
                    res.send(users);
                }
            })
    });
    app.get('/api/login', (req, res) =>{
       users.findOne({email: req.headers['email'], password: req.headers['password']})
           .exec((err, user) =>{
               if (err){
                   res.send("ERROR")
               } else {
                   const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, secretKey);
                   res.send({token: token});
               }
           })
    });
};