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

exports.remove = function (req, res) {
    var image = req.image
    image.remove(function(err){
        res.send({});
    })
}