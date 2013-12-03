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
    };
    if(req.user){
        delete options.criteria.private
    }
    var locals = { title: 'Main Page' };

    async.auto({
            recent_images: function(cb) {
                Image.list(options, safe(cb, function(images) {
                    cb(null, images);
                }));
            },
            viewed_images: function(cb) {
                Image.list(_.extend(options, {perPage: 6, sort: {'viewsCount': -1}}),  safe(cb, function(images) {
                    cb(null, images);
                }));
            },
            images: function(cb) {
                Image.list({}, safe(cb, function(images) {
                    cb(null, images);
                }));
            },
            contests: function(cb) {
                var date = new Date();
                date.setMonth(date.getMonth()-1);

                Contest.list({criteria: {dueDate: {'$gt' : Date.now()}}}, function(err, contests) {
                    if(err){
                        cb(err);
                    }
                    cb(null, contests);
                });
            },
            contests_images: ['contests', function(cb, result) {
                var contests = result.contests;
                if (contests && contests.length) {
                    var opts = {
                        query: { 'contest.contest': { $in: contests}, private: {$ne: true} },
                        map: function() {
                            emit(this.contest.contest, this);
                        },
                        reduce: function(key, values) {
                            return { images: values.slice(0, 2) };
                        }
                    };  
                    if (req.user) {
                      opts.query = { 'contest.contest': { $in: contests} }
                    }
                    
                    Image.mapReduce(opts, function(err, results) {
                        _.each(results, function(result){
                            var contest = _.findWhere(contests, {'id': result._id + ''});
                            contest.images = result.value.images ? result.value.images : [result.value];
                        });
                        cb();
                    });
                } else {
                    cb();
                }
            }]
        },
        function(err, results) {
            locals = _.defaults(locals, results);
            if (err) {
                return req.render('500');
            }
            res.render('root/index.ect', locals);
        }
    );
};
