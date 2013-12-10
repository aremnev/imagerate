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
        //Profile link helper
        res.locals.h.profileLink = profileLink;
        //Date condition helper, becomes true if date in the past
        res.locals.h.dateCondition = function (condition, date, isOp) {
            return condition || (!isOp && helpers.isPastDate(date));
        };
        //Condition for user permissions.
        res.locals.h.authCondition = function(req) {
            return function(condition, ifOr, type) {
                var auth;
                switch(type) {
                    case 'admin':
                        auth = req.isAdmin();
                        break;
                    default:
                        auth = req.isAuthenticated();

                }
                return ifOr ? condition || auth : auth && condition;
            }
        }(req);
        //check user can participate in contest
        res.locals.h.canParticipate = function(contest, mail){
            var can = false;
            mail = mail || req.user.email;
            contest = contest || req.contest;
            if(req.isAdmin() || (contest.group && contest.group.checkEmail(mail))){
                can = true;
            }
            return can;
        };
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
