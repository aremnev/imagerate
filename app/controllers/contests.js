/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Contest = mongoose.model('Contest'),
    Image = mongoose.model('Image');


/**
 * Find contest by id
 */

exports.contest = function(req, res, next, id){
    Contest.findOne({_id: id}, function (err, contest) {
        if (err) return next(err)
        if (!contest) return next(new Error('Failed to load contest ' + id))
        req.contest = contest
        next()
    })
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

exports.show = function (req, res) {
    var options = {perPage: 30,  criteria: {}},
        contest = req.contest;
    Contest.list(options, function(err, contests){
        if (err) return res.render('500');
        var result = {contests: contests}
        if(contest) {
            var page = parseInt(req.param('page') > 0 ? req.param('page') : 1);
            var i_options = {
                perPage: 10,
                page: page - 1,
                criteria: {'contest.contest': contest._id}
            }
            Image.list(i_options, function(err, images){
                if (err) return res.render('500');
                    Image.count(i_options.criteria).exec(function (err, count) {
                    result.images = images;
                    result.page = page;
                    result.pages = Math.ceil(count / i_options.perPage);
                    return res.render('contests/show.ect', result);
                });
            });
        } else {
            res.render('contests/show.ect', result);
        }
    });
}