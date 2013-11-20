
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    validate = require('../middlewares/validate');

module.exports = function (app, passport, auth, config) {
    // user routes
    var users = require('../controllers/users');
    app.get('/login', auth.requiresLogout, auth.setCallbackUrl, users.login);
    app.get('/logout', auth.requiresLogin, users.logout);
    //app.post('/users', users.create);
    if(config.test) {
        app.get('/signup', users.signup);
        app.post('/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session);
    }
    app.get('/users/:userId', auth.requiresLogin, users.profile);
    app.get('/auth/google', auth.setCallbackUrl, passport.authenticate('google', { failureRedirect: '/login', failureFlash: true, scope: config.google.scope }), users.signin);
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', failureFlash: true, scope: 'https://www.google.com/m8/feeds' }), users.authCallback);
    app.param('userId', users.user);


    // image routes
    var images = require('../controllers/images');
    app.get('/images/recent', images.recentList);
    //app.get('/images/rated', images.ratedList);
    app.get('/images/viewed', images.viewedList);
    app.get('/images/:imageId', auth.restrictedAccess, images.show);
    app.del('/images/:imageId',  auth.requiresLogin, auth.image.hasAuthorization, images.remove);
    app.get('/images/:imageId/raw', auth.adminAccess, images.raw);
    app.param('imageId', images.image);


    // Rating routes
    var rating = require('../controllers/rating.js');
    app.post('/images/:imageId/rate/:rateValue', auth.requiresLogin, rating.rateImage);
    app.param('rateValue', /^[1-5]$/);


    // comments routes
    var comments = require('../controllers/comments');
    app.post('/images/:imageId/comment', auth.requiresLogin, validate.createComment, comments.create);


    // contests routes
    var contests = require('../controllers/contests');
    app.post('/contests', auth.requiresLogin, auth.adminAccess, validate.createContest, contests.create);
    app.delete('/contests/:contestId', auth.requiresLogin, auth.adminAccess, contests.delete);
    app.get('/contests', contests.list);
    app.get('/contests/:contestId', auth.restrictedAccess, contests.detail);
    app.get('/contests/:contestId/edit', auth.requiresLogin, auth.adminAccess, contests.editPage);
    app.post('/contests/:contestId', auth.requiresLogin, auth.adminAccess, validate.createContest, contests.update);
    app.post('/contests/:contestId/images', auth.requiresLogin, validate.createImage, images.create);
    app.param('contestId', contests.contest);


    // home route
    var root = require('../controllers/root');
    app.get('/', root.index);
}
