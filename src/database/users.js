const mongoose = require('mongoose');

let eventSchema = new mongoose.Schema({
    name: String,
    repeat: Number,
    start: Number,
    end: Number,
    description: String
});

let scheduleSchema = new mongoose.Schema({
    events : [eventSchema]
});

let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    schedule: scheduleSchema,
});

mongoose.model('Event', eventSchema, 'events');
mongoose.model('User', userSchema, 'users');
mongoose.model('Schedule', scheduleSchema, 'schedules');

