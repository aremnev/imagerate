/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Image = mongoose.model('Image'),
    Contest = mongoose.model('Contest');


exports.index = function (req, res) {
    var options = {
        perPage: 10,
        page: 0
    }

    Image.list(options, function(err, images) {
        res.render('root/index.ect', {
            title: '',
            images: images
        })
    });
}
