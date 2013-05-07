
var mongoose = require('mongoose')
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    _ = require('underscore'),
    User = mongoose.model('User');


module.exports = function (passport, config) {

    // serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
        User.findOne({ _id: id }, function (err, user) {
            done(err, user)
        })
    })

    // use local strategy, only for testing
    passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(email, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err) }
            if (!user) {
                return done(null, false, { message: 'Unknown user' })
            }
            return done(null, user)
        })
    }
    ))

    // use google strategy
    passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        var profile = profile._json;
        User.findOne({$or:[
            { 'google.id': profile.id },
            { 'email': profile.email }]}, function (err, user) {
            if(!user) user = new User({email: profile.email});
            if(user.google && _.isEqual(user.google, profile)) {
                return done(err, user);
            }
            user.name = profile.name;
            user.provider = 'google';
            user.google = profile;
            user.save(function (err) {
                if (err) console.log(err)
                return done(err, user);
            })
        });
    }
    ));
}
