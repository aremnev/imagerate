/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Contest = mongoose.model('Contest'),
     _ = require('underscore'),
    async = require('async'),
    Group = mongoose.model('Group');


module.exports = function(cfg) {

    return function(req, res, next) {
        async.series([
            function(callback) {
//                Group.isAdmin(req.user.email, function(group){
//                    req.isAdmin = function(){
//                        return !!group;
//                    };
//                    callback();
//                });
                Group.list({isAdmins: true}, function(err, groups){
                    req.isAdmin = function() {
                        var isAdmin = false;
                        if (req.isAuthenticated()) {
                            for(var i in groups){
                                if(groups[i].checkEmail(req.user.email)){
                                    isAdmin = true;
                                }
                            }
                        }
                        return isAdmin;
                    };
                    callback();
                });
            },
            function(callback){
                var options = {perPage: 5};
                Contest.list(options, function(err, contests){
                    res.locals.extra = res.locals.extra || {};
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