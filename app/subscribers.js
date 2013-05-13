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
                    callback();
                });
            },
            function(callback){
                if(cfg.test && req.param('json')) {
                    res.render = function(view, options, fn) {
                        options = options || {};
                        options.extra = res.locals.extra
                        options.extra.user = req.user;
                        options.extra.profile = req.profile;
                        return res.json(options);
                    }
                }
                callback();
            }

        ],
        function(err, results){
            next();
        })
    }
}

module.exports = subscribers;