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
        if (err) return res.render('500');
        return res.json({contest: contest});
    })
}


/**
 * Contest create
 */

exports.update = function (req, res) {
    var contest = req.contest;
    contest.update(req.body, function (err) {
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
            var i_options = {perPage: 10,
                criteria: {'contest.contest': contest._id}
            }
            Image.list(i_options, function(err, images){
                if (err) return res.render('500');
                result.images = images;
                return res.render('contests/show.ect', result);
            });
        } else {
            res.render('contests/show.ect', result);
        }
    });
}