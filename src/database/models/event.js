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

mongoose.model('Event', eventSchema, 'events');