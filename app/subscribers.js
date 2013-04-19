/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Contest = mongoose.model('Contest'),
     _ = require('underscore');


function subscribers (cfg) {
    return function (req, res, next) {
        Contest.list({perPage: 5}, function(err, contests){
            res.locals.contests = contests;
        });
        next()
    }
}

module.exports = subscribers;