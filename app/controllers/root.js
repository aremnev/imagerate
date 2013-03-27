/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Contest = mongoose.model('Contest');


exports.index = function (req, res) {
    res.render('root/index.ect', {
        title: '',
        contests: Contest.find({})
    })
}
