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
    var likes = req.image.contest.evaluations.filter(function(evaluation) {
        return evaluation.rating === 5;
    });

    res.render('images/show.ect', {
        title: req.image.title,
        likesCount: likes.length,
        likes: likes.slice(0, 20)
    });
}

/**
 * Create an image
 */

exports.create = function (req, res) {
    var image = new Image(req.body)
    image.user = req.user

    image.uploadAndSave(req.files.image, function (err) {
        if (err) {
            res.redirect('/users/' + req.user.id)
        }
        else {
            res.redirect('/users/' + req.user.id)
        }
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