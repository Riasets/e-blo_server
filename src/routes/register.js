const mongoose = require('mongoose');
const users = mongoose.model('User');

module.exports = function(app, db) {
    app.post('/api/register', (req, res) => {
        if (req.body.email && req.body.password) {
            users.find({email: req.body.email})
                .exec((err,res) => {
                    if(res){
                        res.status(400).send({error: "User with this email already exist"});
                    } else {
                      newUser = {
                          email: req.body.email,
                          password: req.body.password,
                          isAdmin: false,
                          importSchedule: null,
                          importEvents: [],
                      }
                      users.create(newUser);
                      users.findOne(newUser)
                          .exec((err, user) =>{
                              if (err) {
                                  res.status(400).send({error: "Database Error", message: err})
                              } else {
                                  schedules.create({copy: false, owner: user._id});
                              }
                          })
                    }
                });
            res.send("OK")
        } else {
            res.status(400).send({error: "Bad request"})
        }
    });
};