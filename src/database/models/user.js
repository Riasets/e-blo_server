const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    ImportSchedule: String,
    ImportEvents: [String],
    friends: [String],
});

mongoose.model('User', userSchema, 'users');

