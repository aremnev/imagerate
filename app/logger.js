var winston = require('winston');

module.exports = function() {
    var transports = [];
    if (!process.env.COVERAGE) {
        transports.push(new (winston.transports.Console)());
    }
    if(process.env.NODE_ENV && process.env.NODE_ENV == 'production') {
        transports.push(new (winston.transports.File)({ filename: 'logs.log' }));
    }
    var logger = new (winston.Logger)({
        transports: transports
    });
    return logger;
}