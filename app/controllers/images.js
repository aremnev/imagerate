/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Image = mongoose.model('Image');


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
    var opts = { path: 'contest.evaluations.user',
                 select: '_id name provider google.picture' };

    Image.populate(req.image, opts, onLikesPopulated);

    function onLikesPopulated(err, image) {
        var likes = image.contest.evaluations.filter(function filterFiveStar(ev) {
            return ev.rating === 5;
        }).slice(0, 20).map(function addProfileImage(ev) {
            var evAsObject = ev.toObject();
            evAsObject.user.image = res.locals.h.profileLink(32, ev.user);
            return evAsObject;
        });

        image.getRatingByUser(req.user, function onRatingReceived(err, ratingByUser) {
            res.render('images/show.ect', {
                title: image.title,
                likesCount: likes.length,
                likes: JSON.stringify(likes),
                ratingByUser: ratingByUser
            });
        });
    }
}

/**
 * Create an image
 */

exports.create = function (req, res) {
    var image = new Image(req.body)
    image.user = req.user

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