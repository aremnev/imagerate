var helpers = require('../helpers');
var gravatar = require('gravatar');

module.exports = function (cfg) {

    function profileLink(size, user) {
        return gravatar.url(user.email, { s: size || 50 });
    }

    return function (req, res, next) {
        res.locals.req = req;
        res.locals.appName = cfg.app.name;

        if (!res.locals.h) res.locals.h = helpers;
        res.locals.h._ = _;
        res.locals.h.profileLink = profileLink;
        res.locals.h.isActive = function(req) {
            return function(url) {
                var result = req._parsedUrl.pathname.indexOf(url) + 1;
                return result > 0;
            }
        }(req);

        next();
    }
}
