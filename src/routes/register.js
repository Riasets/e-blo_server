const mongoose      = require('mongoose');
const users         = mongoose.model('User');
const schedules     = mongoose.model('UserSchedule');
const crypto        = require('crypto');

module.exports = function(app, db) {
    app.post('/api/register', (req, res) => {
        if (req.body.email && req.body.password) {
            users.find({email: req.body.email})
                .exec((err,user) => {
                    if(user[0] !== undefined){
                        res.status(400).send({error: "User with this email already exist"});
                    } else {
                      const newUser = {
                          email: req.body.email,
                          password: crypto.createHash('md5').update(req.body.password).digest('hex'),
                          isAdmin: false,
                          importSchedule: null,
                          importEvents: [],
                      };
                      users.create(newUser, (err, user) => {
                          if (err) {
                              res.status(400).send({error: "Database Error", message: err})
                          } else {
                              schedules.create({copy: false, owner: user._id});
                              res.send("OK");
                          }
                      });
                    }
                });
        } else {
            res.status(400).send({error: "Bad request"})
        }
    });
};