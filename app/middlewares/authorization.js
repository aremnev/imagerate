
/*
 *  Generic require login routing middleware
 */
var url = require('url');

var auth = function(cfg) {
    return {
        requiresLogin: function (req, res, next) {
            if (!req.isAuthenticated()) {
                return res.redirect('/login')
            }
            next();
        },

        requiresLogout: function (req, res, next) {
            if (req.isAuthenticated()) {
                return res.redirect('/')
            }
            next();
        },

        adminAccess: function (req, res, next) {
            if (!req.isAdmin()) {
                console.log('test');
                return res.status(404).render('404.ect');
            }
            next();
        },

        restrictedAccess : function(req, res, next) {
            var contestIsPrivate = false;
            if(req.contest){
                contestIsPrivate = req.contest.private;
            } else if (req.image) {
                contestIsPrivate = req.image.private;
            }
            if(contestIsPrivate && !req.isAuthenticated()){
                var locals = {
                    message: "Contest &laquo;%s&raquo; is private. Please sign in to view images.",
                    contest : req.contest
                };
                return res.render('users/login.ect', locals);
            }
            next();
        },

        setCallbackUrl : function(req, res, next){
            var referrer = req.header('Referrer');
            if(referrer){
                var urlParts = url.parse(referrer);
                if(urlParts.hostname === req.host && urlParts.path !== '/login'){
                    res.cookie('redirectPath', urlParts.path, {secure : false});
                }
            }
            next();
        },




        user: {
            hasAuthorization : function (req, res, next) {
                if (req.profile.id != req.user.id) {
                    return res.send(403, { error: 'Forbidden' });
                }
                next()
            }
        },

        image: {
            hasAuthorization : function (req, res, next) {
                if (req.image.user.id != req.user.id) {
                    return res.send(403, { error: 'Forbidden' });
                }
                next()
            }
        }
    }
}

module.exports = auth;
