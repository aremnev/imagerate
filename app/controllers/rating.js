/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Image = mongoose.model('Image');


/**
 * Find image by id
 */

exports.rateImage = function rateImage(req, res) {
    var image = req.image;
    var rateValue = Number(req.params.rateValue.input);

    image.saveNewRateValue(rateValue, req.user, onRatingReceived);

    function onRatingReceived(err) {
        if (err) {
            return res.render('500');
        }

        res.send({
            imageId: image._id,
            rating: image.contest.rating
        });
    }
};