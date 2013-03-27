
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    async = require('async');

module.exports = function (app, passport, auth) {

    // user routes
    var users = require('../app/controllers/users');
    app.get('/login', auth.requiresLogout, users.login);
    app.get('/signup', users.signup);
    app.get('/logout', auth.requiresLogin, users.logout);
    app.post('/users', users.create);
    app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session);
    app.get('/users/:userId', users.profile);
    app.get('/auth/google', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.signin)
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.authCallback)

    app.param('userId', users.user);
    
    
    // home route
    var root = require('../app/controllers/root');
    app.get('/', root.index);
}
