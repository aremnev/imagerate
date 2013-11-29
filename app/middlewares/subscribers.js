/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Contest = mongoose.model('Contest'),
     _ = require('underscore'),
    async = require('async');


module.exports = function(cfg) {

    return function(req, res, next) {
        async.series([
            function(callback) {
                req.isAdmin = function() {
                    var emails = cfg.admin.emails || [],
                        regexp = cfg.admin.regexp;
                    if (!req.isAuthenticated() ||
                        (emails.indexOf(req.user.email) == -1 && (!regexp || !req.user.email.match(regexp, 'ig')))) {
                        return false;
                    }
                    return true;
                }
                callback();
            },
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