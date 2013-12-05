/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Contest = mongoose.model('Contest'),
    Image = mongoose.model('Image'),
    async = require('async'),
    helpers = require('../helpers'),
    safe = helpers.safe;


/**
 * Find contest by id
 */

exports.contest = function(req, res, next, id){
    var query = Contest.findOne({});
    if (id.match(/^[0-9a-fA-F]{24}$/)) { //if id is valid ObjectId
        query.where('_id').equals(id);
    }else{
        query.where('alias').equals(id);
    }
    query.exec(function (err, contest) {
        if (!contest) {
            return res.status(404).render('404.ect');
        }
        req.contest = contest;
        next();
    });
};

/**
 * Contest create
 */

exports.create = function (req, res) {
    var contest = new Contest(req.body);
    contest.save(function (err) {
        if (err) {
            return res.json(401, {
                message: err.message
            });
        }
        return res.format({
            text: function(){
                res.redirect('/contests/' + contest.link);
            },
            json: function(){
                res.json({ contest: contest });
            }
        });
    })
};


/**
 * Contest delete
 */

exports.delete = function (req, res) {
    req.contest.remove(function (err) {
        if (err) return res.json(401, {
            message: err.message
        });
        return res.json({ ok: true });
    })
};


/**
 * Contest update
 */

exports.update = function (req, res) {
    Contest.findById(req.contest._id, function(err, contest){
        if (err) res.render('500');
        contest = _.extend(contest, _.defaults(req.body, {
            showAuthor:false,
            showComments:false,
            private: false,
            exhibition: false
        }));
        contest.save(function (err){
            if (err) res.render('500');
            return res.format({
                text: function(){
                    res.redirect('/contests/' + contest.link);
                },
                json: function(){
                    res.json({ contest: contest });
                }
            });
        })
    });
};

/**
 * Edit contest page
 * @param req
 * @param res
 */
exports.editPage = function(req, res){
    var locals = {contest : req.contest};
    res.render('contests/edit.ect', locals);
};

/**
 * Contest page
 */

exports.list = function (req, res) {
    var locals = {};

    async.series([
        function loadContests(callback) {
            var options = {
                    perPage: 30,
                    criteria: {},
                    sort: {'dueDate': -1}
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


};

exports.detail = function(req, res) {
    var contest = req.contest,
        imageOptions = helpers.paginationOps(15, req.param('page'));

    imageOptions.criteria = {'contest.contest': contest._id};

    if(helpers.isPastDate(contest.dueDate)) {
        imageOptions.sort = {'contest.ratingSum': -1}
    }

    async.auto({
            'imageAddedCount': function(cb) {
                if (!req.isAuthenticated()) {
                    return cb(null, 0);
                }

                var criteria = {
                    'contest.contest': contest._id,
                    'user': req.user._id
                };
                Image.count(criteria).exec(cb);
            },
            'ratedImagesCount': function(cb) {
                if (!req.isAuthenticated()) {
                    return cb(null, 0);
                }
                var criteria = {
                    'contest.contest': contest._id,
                    'contest.evaluations.user': req.user._id
                };
                Image.count(criteria).exec(cb);
            },
            'imagesResult': function (cb) {
                Image.paginableList(imageOptions, cb);
            },
            'usersCount': ['imagesResult', userStatsForContest]
        },
        function render(err, results) {
            if (err) {
                return res.render('500');
            }
            var locals = _.extend({title: contest.title, contest: contest}, results);
            res.render('contests/detail.ect', locals);
        }
    );

    function userStatsForContest(cb, results) {
        if (results.imagesResult.pageInfo.count === 0) {
            return cb(null, 0);
        }

        var opts = {
            query: imageOptions.criteria,
            map: function() { emit(this.user, 1); },
            reduce: function(key, values) { return values.length; }
        };

        Image.mapReduce(opts, function(err, result){
            cb(err, result.length);
        });
    }
};

