/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Image = mongoose.model('Image'),
    async = require('async'),
    safe = require('../async_helpers').safe;


/**
 * Find image by id
 */

exports.image = function(req, res, next, id){

    Image.load(id, function (err, image) {
        if (err) return next(err)
        if (!image) return next(new Error('Failed to load image ' + id))
        req.image = image
        next()
    })
}

/**
 * Image page
 */

exports.show = function (req, res) {
    var locals = {
        image: req.image,
        title: req.image.title
    };
    var opts = { path: 'contest.evaluations.user',
                 select: '_id name provider google.picture' };

    async.series([
            populateLikes,
            getRatingByUser
        ], function render(err) {
            if (err) {
                return res.render('500');
            }
            res.render('images/detail.ect', locals);
        }
    );

    function populateLikes(callback) {
        Image.populate(req.image, opts, safe(callback, function(image) {
            var likes = image.contest.evaluations.filter(function filterFiveStar(ev) {
                return ev.rating === 5;
            }).slice(0, 20).map(function addProfileImage(ev) {
                var evAsObject = ev.toObject();
                evAsObject.user.image = res.locals.h.profileLink(32, ev.user);
                return evAsObject;
            });
            locals.likes = likes;
        }));

    }

    function getRatingByUser(callback) {
        if (!req.isAuthenticated()) {
            return callback();
        }

        locals.image.getRatingByUser(req.user, safe(callback, function(ratingByUser) {
            locals.ratingByUser = ratingByUser;
        }));
    }
}

/**
 * Create an image
 */

exports.create = function (req, res) {
    var body = req.body;
    var image = new Image({
        contest: {contest: body.contest.contest},
        title: body.title
    })
    image.user = req.user;
    image.uploadAndSave(req.files.image, function (err) {
        if(err) res.json(400, { error: err });
        res.json({ ok: true });
    })
}

/**
 * Remove image
 */

exports.remove = function (req, res) {
    var image = req.image
    image.remove(function(err){
        res.send({});
    })
}