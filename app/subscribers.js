/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Contest = mongoose.model('Contest'),
     _ = require('underscore'),
    async = require('async');


function subscribers (cfg) {



    return function(req, res, next) {
        async.series([

            function(callback){
                var options = {perPage: 5};
                Contest.list(options, function(err, contests){
                    res.locals.extra = res.locals.extra || {}
                    res.locals.extra.contests = contests;
                    callback(null, true);
                });
            },
            function(callback){
                console.log(res);
                callback(null, true);
            }

        ],
        function(err, results){
            console.log(results);
            next();
        })
    }
}

module.exports = subscribers;