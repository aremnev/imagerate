var winston = require('winston');

module.exports = function(cfg) {
    var transports = [
        new (winston.transports.File)({ filename: 'logs.log' })
    ]
    if (!process.env.COVERAGE) {
        transports.push(new (winston.transports.Console)());
    }
    var logger = new (winston.Logger)({
        transports: transports
    });
    return logger;
}