const mongoose = require('mongoose');
const users = mongoose.model('User');
const schedules = mongoose.model('UserSchedule');
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
       users.findOne({email: req.headers['email'], password: req.headers['password']})
           .exec((err, user) =>{
               console.log(err, user);
               if (!user){
                   res.status(404).send({error : "User not found"});
               } else {
                   schedules.findOne({owner: user._id})
                       .exec((err, schedule) => {
                           console.log(err, schedule);
                           if (err){
                               res.status(404).send({error : "Schedule not found"});
                           } else {
                               const token = jwt.sign({id: user._id, isAdmin: user.isAdmin, schedule: schedule._id, importSchedule: user.importSchedule, importEvents: user.importEvents}, secretKey);
                               res.send({token: token, name: user.name, email: user.email, isAdmin: user.isAdmin});
                           }
                       })
               }
           })
    });
};