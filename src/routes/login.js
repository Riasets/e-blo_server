const mongoose = require('mongoose');
const users = mongoose.model('User');
const schedules = mongoose.model('UserSchedule');
const tokens = mongoose.model('RefreshToken');
const jwt = require('jsonwebtoken');
const secretKey = require('./env');
const crypto = require('crypto');

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
       users.findOne({email: req.headers.email, password: crypto.createHash('md5').update(req.headers.password).digest('hex')})
           .exec((err, user) =>{
               if (!user){
                   res.status(404).send({error : "User not found"});
               } else {
                   schedules.findOne({owner: user._id})
                       .exec((err, schedule) => {
                           if (err){
                               res.status(404).send({error : "Schedule not found"});
                           } else {
                               const token = jwt.sign({id: user._id, isAdmin: user.isAdmin, schedule: schedule._id, importSchedule: user.importSchedule, importEvents: user.importEvents}, secretKey);
                               const refreshToken = { token: jwt.sign({id: user._id, isAdmin: user.isAdmin, schedule: schedule._id, importSchedule: user.importSchedule, importEvents: user.importEvents}, secretKey, { expiresIn: "2d" })};
                               tokens.create(refreshToken, (err, refresh) => {
                                   console.log(err, user);
                                   if (err) {
                                       res.status(400).send({error: "Database Error", message: err})
                                   } else {
                                       res.send({token: token, refreshToken: refresh.token, name: user.name, email: user.email, isAdmin: user.isAdmin});
                                   }
                               });

                           }
                       })
               }
           })
    });
};