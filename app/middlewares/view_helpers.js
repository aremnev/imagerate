var helpers = require('../helpers');

module.exports = function (cfg) {

    function profileLink(user) {
        return user.google.picture || cfg.google.photoPlaceholder.format(user.google.gender || "other");
    }

    return function (req, res, next) {
        res.locals.req = req;
        res.locals.appName = cfg.app.name;

        if (!res.locals.h) res.locals.h = helpers;
        res.locals.h._ = _;
        res.locals.h.profileLink = profileLink;
        res.locals.t = req.gettext;
        res.locals.f = req.format;
        res.locals.h.isActive = function(req) {
            return function(url) {
                var result = req._parsedUrl.pathname.indexOf(url) + 1;
                return result > 0;
            }
        }(req);

        next();
    }
}
