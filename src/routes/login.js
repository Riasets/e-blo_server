const mongoose = require('mongoose');
const users = mongoose.model('User');
const jwt = require('jsonwebtoken');
const secretKey = require('./env');

module.exports = function(app, db) {
    app.get('/api/users', (req, res) => {
        users.find()
            .exec((err, users) =>{
                if (err){
                    res.send("ERROR");
                } else {
                    res.send(users);
                }
            })
    });
    app.get('/api/login', (req, res) =>{
        console.log(req.headers);
       users.findOne({email: req.headers['email'], password: req.headers['password']})
           .exec((err, user) =>{
               console.log(err);
               console.log(user);
               if (!user){
                   res.status(404).send({error : "User not found"});
               } else {
                   const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, secretKey);
                   res.send({token: token, name: user.name, email: user.email, schedule: user.schedule, isAdmin: user.isAdmin});
               }
           })
    });
};