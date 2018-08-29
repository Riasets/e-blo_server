const mongoose = require('mongoose');
const readline = require('readline');
const dbURI = 'mongodb://localhost/E-blo_database';
mongoose.connect(dbURI, { useNewUrlParser: true });

if (process.platform === 'win32') {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on("SIGINT", function(){
        process.emit ('SIGINT');
    });
};

mongoose.connection.on('connected', function(){
    console.log("Mongoose connected to " + dbURI);
});
mongoose.connection.on('error', function(err){
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function(){
    console.log('Mongoose disconnected');
});


let gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

process.once('SIGUSR2', function () {
  gracefulShutdown('app termination', function () {
      process.kill(process.pid, 'SIGUSR2');
  });
});
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function (){
        process.exit(0);
    });
});
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    });
});

require('./users');
