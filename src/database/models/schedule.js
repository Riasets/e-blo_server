const mongoose = require('mongoose');

let scheduleUserSchema = new mongoose.Schema({
    events : [String],
    owner : String,
    copy : Boolean,
});

mongoose.model('UserSchedule', scheduleUserSchema, 'schedules');
