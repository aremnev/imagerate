
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Image = mongoose.model('Image');

exports.signin = function (req, res) {}

/**
 * Auth callback
 */

exports.authCallback = function (req, res, next) {
    res.redirect('/')
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
    res.redirect('/users/' + res.profile.id);
}

/**
 * Create user
 */

exports.create = function (req, res) {
    var user = new User(req.body)
    user.provider = 'local'
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
    var user = req.profile
    var page = req.param('page') > 0 ? req.param('page') : 0
    var perPage = 5
    var options = {
        perPage: perPage,
        page: page,
        user: req.profile.id
    }

    Image.list(options, function(err, images) {
        if (err) return res.render('500')
        Image.count().exec(function (err, count) {
            res.render('users/profile.ect', {
                title: user.name,
                images: images,
                page: page,
                pages: count / perPage
            })
        })
    })

}

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
    User
        .findOne({ _id : id })
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        })
}
