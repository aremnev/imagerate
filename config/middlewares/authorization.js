
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    next();
};

exports.requiresLogout = function (req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next();
};


/*
 *  User authorizations routing middleware
 */

exports.user = {
    hasAuthorization : function (req, res, next) {
        if (req.profile.id != req.user.id) {
            return res.send('403 error');
        }
        next()
    }
}


/*
 *  Article authorizations routing middleware
 */

exports.image = {
    hasAuthorization : function (req, res, next) {
        if (req.image.user.id != req.user.id) {
            return res.send('403 error');
        }
        next()
    }
}
