
var mongoose = require('mongoose')
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth').Strategy,
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

    // use local strategy
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err) }
            if (!user) {
                return done(null, false, { message: 'Unknown user' })
            }
            if (!user.authenticate(password)) {
                return done(null, false, { message: 'Invalid password' })
            }
            return done(null, user)
        })
    }
    ))

    // use google strategy
    passport.use(new GoogleStrategy({
        consumerKey: config.google.clientID,
        consumerSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ 'google.id': profile.id }, function (err, user) {
        if (!user) {
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                username: profile.username,
                provider: 'google',
                google: profile._json
            })
            user.save(function (err) {
            if (err) console.log(err)
                return done(err, user);
            })
        } else {
            return done(err, user)
        }
        });
    }
    ));
}
