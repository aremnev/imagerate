/**
 * Module dependencies.
 */

var async = require('async'),
    _ = require('underscore'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Image = mongoose.model('Image'),
    Contest = mongoose.model('Contest'),
    safe = require('../async_helpers').safe;


exports.index = function (req, res) {
    var options = {
        perPage: 5,
        page: 0
    }
    var locals = { title: 'Main Page'}

    async.parallel([
            function(cb){
                Image.list(options, safe(cb, function(images) {
                    locals.recent_images = images;
                }));
            },
            function(cb){
                Image.list(_.extend(options, {sort: {'viewsCount': -1}}),  safe(cb, function(images) {
                    locals.viewed_images = images;
                }));
            }
        ],
        function(err) {
            if (err) {
                return req.render('500');
            }
            res.render('root/index.ect', locals);
        }
    );
}
