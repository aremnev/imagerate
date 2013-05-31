/**
 * Module dependencies.
 */

var url = require('url'),
    qs = require('querystring'),
    _ = require('underscore'),
    moment = require('moment'),
    cloudinary = require('cloudinary');

module.exports = {
    //Url image helpers
    imageUrl: function (image, options) {
        return cloudinary.url(image.data.public_id, options) + '.jpg'
    },

    //Date helpers
    formatTime: function(date, format) {
        format = format || 'HH:mm MMM DD, YYYY';
        try {
            return moment(date).format(format);
        } catch (e) {
            return null;
        }
    },
    formatDate: function (date) {
        return this.formatTime(date, 'MMM DD, YYYY');
    },
    isPastDate: function(date) {
        var date = new Date(date);
        var now = new Date();
        return date < now;
    },
    isNewDate: function(date) {
        var date = new Date(date);
        var now = new Date();
        return date > now;
    },
    isOwner: function(image, user) {
        return (image.user._id + '' == user._id + '');
    },

    //Async helpers
    safe: function (callback, func, isExecuteCallback) {
        return function(err) {
            if (err) {
                return callback(err);
            }
            var args = Array.prototype.slice.call(arguments, 1);
            func.apply(null, args);
            if (!isExecuteCallback && callback) {
                args.unshift(null);
                callback.apply(this, args);
            }
        };
    }
}