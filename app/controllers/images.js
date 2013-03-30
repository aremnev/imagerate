/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Image = mongoose.model('Image');

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