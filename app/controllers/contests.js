/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Contest = mongoose.model('Contest'),
    Image = mongoose.model('Image'),
    async = require('async'),
    safe = require('../async_helpers').safe;


/**
 * Find contest by id
 */

exports.contest = function(req, res, next, id){
    Contest.findOne({_id: id}, function (err, contest) {
        if (err) {
            return next(err);
        }
        if (!contest) {
            return next(new Error('Failed to load contest ' + id));
        }
        req.contest = contest;
        next();
    });
}

/**
 * Contest create
 */

exports.create = function (req, res) {
    var contest = new Contest(req.body);
    contest.save(function (err) {
        if (err) return res.json(401, {
            message: err.message
        });
        return res.json({
            contest: contest
        });
    })
}


/**
 * Contest create
 */

exports.update = function (req, res) {
    Contest.findByIdAndUpdate(req.contest._id, req.body, function (err, contest) {
        if (err) return res.render('500');
        return res.json({contest: contest});
    })
}

/**
 * Contest page
 */

exports.list = function (req, res) {
    var locals = {};

    async.series([
        function loadContests(callback) {
            var options = {
                    perPage: 30,
                    criteria: {}
                };
            Contest.list(options, safe(callback, function(contests) {
                locals.contests = contests;
            }));
        },
        function loadImagesForContests(callback) {
            callback();
        },
        function loadUserStats(callback) {
            callback();
        }], function(err) {
            if (err) {
                return req.render('500');
            }
            res.render('contests/list.ect', locals);
        }
    );


}

exports.detail = function(req, res) {
    var contest = req.contest;
    var locals = {contest: contest};
    var page = parseInt(req.param('page'));

    page = locals.page = page > 0 ? page : 1;

    var imageOptions = {
        perPage: 10,
        page: page - 1,
        criteria: {'contest.contest': contest._id}
    };

    async.parallel([
            loadContestImages,
            loadStatsForCurrentUser,
            function(callback) {
                async.series([
                    countImagesInContest,
                    loadUsersStatsRegardingContest
                ], callback);
            }
        ], function render(err) {
            if (err) {
                console.log(err);
                return res.render('500');
            }
            res.render('contests/detail.ect', locals);
        }
    );

    function loadContestImages(callback) {
        Image.list(imageOptions, safe(callback, function(images){
            locals.images = images;
        }));
    }

    function countImagesInContest(callback) {
        Image.count(imageOptions.criteria).exec(safe(callback, function (count) {
            locals.pages = Math.ceil(count / imageOptions.perPage);
            locals.imagesTotalCount = count;
        }));
    }

    function loadUsersStatsRegardingContest(callback) {
        if (locals.imagesTotalCount === 0) {
            return callback();
        }

        var opts = {
            query: imageOptions.criteria,
            map: function() { emit(this.user, 1); },
            reduce: function(key, values) { return values.length; }
        };

        Image.mapReduce(opts, safe(callback, function(result) {
            locals.usersCount = result.length;
        }));
    }

    function loadStatsForCurrentUser(callback) {
        if(req.user) {
            var criteria = {
                'contest.contest': contest._id,
                'contest.evaluations.user': req.user._id
            };
            Image.count(criteria).exec(safe(callback, function (count) {
                locals.ratedImagesCount = count;
            }));
        } else {
            callback();
        }
    }
};

