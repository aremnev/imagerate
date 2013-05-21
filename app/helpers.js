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
            return formatDate;
        }(req);
        res.locals.h.formatTime = function(req){
            return formatTime;
        }(req);
        res.locals.h.imageUrl = imageUrl(req);
        res.locals.h.isActive = function(req) {
            return function(url) {
                var result = req._parsedUrl.pathname.indexOf(url) + 1;
                return result > 0;
            }
        }(req);
        res.locals.h.isPastDate = isPastDate;
        res.locals.h.isNewDate = isNewDate;
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

function formatTime(date, format) {
    format = format || 'HH:mm MMM DD, YYYY';
    try {
        return moment(date).format(format);
    } catch (e) {
        return null;
    }
}

function formatDate(date) {
    return formatTime(date, 'MMM DD, YYYY');
}

function isPastDate(date) {
    var date = new Date(date);
    var now = new Date();
    return date < now;
}

function isNewDate(date) {
    var date = new Date(date);
    var now = new Date();
    return date > now;
}