
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Contest = mongoose.model('Contest'),
    Image = mongoose.model('Image'),
    async = require('async'),
    helpers = require('../helpers'),
    safe = require('../helpers').safe;

exports.signin = function (req, res) {}

/**
 * Auth callback
 */

exports.authCallback = function (req, res, next) {
    if(req.cookies.redirectPath){
        res.clearCookie('redirectPath');
        res.redirect(req.cookies.redirectPath);
    }else{
        res.redirect('/users/' + req.user.id);
    }
}

/**
 * Show login form
 */

exports.login = function (req, res) {
    res.render('users/login.ect', {
        title: 'Login',
        message: req.flash('error')
    })
}

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
    res.render('users/signup.ect', {
        title: 'Sign up',
        user: new User()
    })
}

/**
 * Logout
 */

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/login');
}

/**
 * Session
 */

exports.session = function (req, res) {
    res.redirect('/users/' + req.user.id);
}

/**
 * Create user
 */

exports.create = function (req, res) {
    var user = new User(req.body)
    user.provider = 'local';
    user.save(function (err) {
        if (err) {
            return res.render('users/signup', { errors: err.errors, user: user })
        }
        req.logIn(user, function(err) {
            if (err) return next(err)
            return res.redirect('/users/' + user.id);
        })
  })
}

/**
 *  Show profile
 */

exports.profile = function (req, res) {
    var user = req.profile,
        contestId = req.param('contest'),
        locals = {title: user.name};
    var options = helpers.paginationOps(15, req.param('page'));
    options.criteria = { user: user.id };

    if(contestId) {
        options.criteria['contest.contest'] = contestId
    }

    async.parallel([
        function(cb) {
            Image.paginableList(options, function(err, result){
                locals.imagesResult = result;
                cb();
            });
        },
        function(cb) {
            var criteria = {
                'contest.evaluations.user': req.user._id
            };
            Image.count(criteria).exec(safe(cb, function (count) {
                locals.ratedImagesCount = count;
            }));
        },
        function(cb) {
            var criteria = {
                'user': req.user._id
            };
            Image.count(criteria).exec(safe(cb, function (count) {
                locals.uploadImagesCount = count;
            }));
        },
        function(cb) {
            var opts = {
                query: { user: user.id },
                map: function() { emit(this.contest.contest, 1); },
                reduce: function(key, values) { return values.length; }
            };
            Image.mapReduce(opts, function(err, result) {
                var ids = _.pluck(result, '_id');
                Contest.find({'_id': { $in: ids}}, safe(cb, function(contests) {
                    locals.contests = contests;
                }));
            });
        }
    ], function(err) {
        if (err) { return req.render('500'); }
        res.render('users/profile.ect', locals);
    });
}

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
    User
        .findOne({ _id : id })
        .exec(function (err, user) {
            if (err || !user) {
                return res.status(404).render('404.ect');
            }
            req.profile = user;
            next();
        })
}
