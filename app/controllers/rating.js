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
    var user = req.user;
    var rateValue = Number(req.params.rateValue.input);

    image.getRatingByUser(user, checkIfAlreadyRated);

    function checkIfAlreadyRated(err, rating) {
        if (rating) {
            return res.send(403, {
                id: image._id,
                error: 'Already rated'
            });
        }

        image.saveNewRateValue(rateValue, user, onRatingReceived);
    }

    function onRatingReceived(err) {
        if (err) {
            return res.render('500');
        }

        var newLike = null;
        if (rateValue == 5) {
            var _user = user.toObject();
            _user.image = res.locals.h.profileLink(32, user);
            newLike = {
                rating: 5,
                user: _user
            };
        }

        res.send({
            id: image._id,
            rating: image.contest.rating,
            count: image.contest.evaluationsCount,
            newLike: newLike
        });
    }
};

