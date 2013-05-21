
/*
 *  Generic require login routing middleware
 */

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
            var emails = cfg.admin.emails || [],
                regexp = cfg.admin.regexp;
            if (!req.isAuthenticated() ||
                (emails.indexOf(req.user.email) == -1 && (!regexp || !req.user.email.match(regexp, 'ig')))) {
                return res.send(400);
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
