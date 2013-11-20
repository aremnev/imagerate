/**
 * Module dependencies.
 */

var async = require('async'),
    _ = require('underscore'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Image = mongoose.model('Image'),
    Contest = mongoose.model('Contest'),
    safe = require('../helpers').safe;


exports.index = function (req, res) {
    var options = {
        perPage: 10,
        page: 0,
        criteria: {
            private : {$ne : true}
        }
    }
    if(req.user){
        delete options.criteria.private
    }
    var locals = { title: 'Main Page'}

    async.parallel([
            function(cb){
                Image.list(options, safe(cb, function(images) {
                    locals.recent_images = images;
                }));
            },
            function(cb){
                Image.list(_.extend(options, {perPage: 6, sort: {'viewsCount': -1}}),  safe(cb, function(images) {
                    locals.viewed_images = images;
                }));
            },
			function(cb){
                Contest.actualList(function(err, contests) {
                    if(err){
                        cb(err);
                    }
                    locals.contests = contests;
                    if(locals.contests){
                        var i = 1;
                        locals.contests.map(function(contest){
                            Image.getByContest(contest, function(err, images){
                                contest.images = images;
                                if(i === locals.contests.length){
                                    cb();
                                }
                                i++;
                            });
                        });
                    }
				});
            },
			function(cb){
                Image.list({}, safe(cb, function(images) {
                    locals.images = images;
                }));
            },
        ],
        function(err) {
            if (err) {
                return req.render('500');
            }
            res.render('root/index.ect', locals);
        }
    );
}
