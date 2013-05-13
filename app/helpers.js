/**
 * Module dependencies.
 */

var url = require('url'),
    qs = require('querystring'),
    _ = require('underscore'),
    moment = require('moment'),
    cloudinary = require('cloudinary');

function helpers (cfg) {
    return function (req, res, next) {
        if (!res.locals.h) res.locals.h = {}
        res.locals.req = req;
        res.locals.h.forms = require('./forms');
        res.locals.h._ = _;
        res.locals.h.profileLink = function(size, user){
            return profileLink(cfg, req, size, user);
        }
        res.locals.h.formatDate = function(req){
            return function(date){
                return moment(date).format();
            }
        }(req);
        res.locals.h.imageUrl = imageUrl(req);
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


function imageUrl (req) {
    return function imageUrl (image, options) {
        return cloudinary.url(image.data.public_id, options) + '.png'
    }
}