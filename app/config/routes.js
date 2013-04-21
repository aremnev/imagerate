
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    async = require('async');

module.exports = function (app, passport, auth, config) {

    // user routes
    var users = require('../controllers/users');
    app.get('/login', auth.requiresLogout, users.login);
    app.get('/logout', auth.requiresLogin, users.logout);
    //app.post('/users', users.create);
    //app.get('/signup', users.signup);
    //app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session);
    app.get('/users/:userId', users.profile);
    app.get('/auth/google', passport.authenticate('google', { failureRedirect: '/login', scope: config.google.scope }), users.signin)
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.authCallback)

    app.param('userId', users.user);

    // image routes
    var images = require('../controllers/images');
    app.post('/images', images.create);
    app.get('/images/:imageId', images.show);
    app.post('/images/:imageId/remove', auth.requiresLogin, auth.image.hasAuthorization, images.remove);

    // comments routes
    var comments = require('../controllers/comments');
    app.post('/images/:imageId/comment', auth.requiresLogin, comments.create);

    app.param('imageId', images.image);

    // contests routes
    var contests = require('../controllers/contests');
    app.post('/contests', auth.requiresLogin, auth.adminAccess, contests.create);
    app.post('/contests/:contestId', auth.requiresLogin, auth.adminAccess, contests.update);
    app.get('/contests', contests.show);
    app.get('/contests/:contestId', contests.show);

    app.param('contestId', contests.contest);

    // home route
    var root = require('../controllers/root');
    app.get('/', root.index);
}
