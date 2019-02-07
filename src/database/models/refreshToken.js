const mongoose = require('mongoose');

let refreshTokenSchema = new mongoose.Schema({
    token: String,
});

mongoose.model('RefreshToken', refreshTokenSchema, 'tokens');