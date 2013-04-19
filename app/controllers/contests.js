/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Contest = mongoose.model('Contest');


/**
 * Find contest by id
 */

exports.contest = function(req, res, next, id){

    Contest.findOne({_id:id}, function (err, contest) {
        if (err) return next(err)
        if (!contest) return next(new Error('Failed to load contest ' + id))
        req.contest = contest
        next()
    })
}

/**
 * Contest page
 */

exports.show = function (req, res) {
    res.render('contests/show.ect', {
        title: req.contest.title
    });
}

/**
 * Contest create
 */

exports.create = function (req, res) {
    if (!req.user || req.user.email != 'dsedelnikov@thumbtack.net') res.render('404');
    var contest = new Contest(req.body);
    contest.save(function (err) {
        if (err) return res.render('500');
        return res.json({contest: contest});
    })
}