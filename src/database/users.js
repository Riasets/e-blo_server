const mongoose = require('mongoose');

let eventSchema = new mongoose.Schema({
    name: String,
    repeat: Number,
    start: Number,
    end: Number,
    description: String,
    numberOfLesson: String,
    day: Date,
    owner: String,
    copy: Boolean,
    isLesson: Boolean,
});

let scheduleUserSchema = new mongoose.Schema({
    events : [String],
    owner : String,
    copy : Boolean,
});

let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    ImportSchedule: String,
    ImportEvents: [String],
    friends: [String],
});

let refreshTokenSchema = new mongoose.Schema({
    token: String,
});

mongoose.model('Event', eventSchema, 'events');
mongoose.model('User', userSchema, 'users');
mongoose.model('UserSchedule', scheduleUserSchema, 'schedules');
mongoose.model('RefreshToken', refreshTokenSchema, 'tokens');
