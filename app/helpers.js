function helpers (cfg) {
    return function (req, res, next) {
        if (!res.locals.h) res.locals.h = {}
        res.locals.h.forms = require('./forms');
        res.locals.h.profileLink = function(size, user){
            return profileLink(cfg, req, size, user);
        }
        next()
    }
}

module.exports = helpers;

function profileLink(cfg, req, size, user) {
    var picture = cfg.google.photoLink;
    if(!user) user = req.user;
    if(user && user.google && user.google.picture) {
        picture = user.google.picture + '?sz={0}';
    }
    return picture.format(size || 50);
}