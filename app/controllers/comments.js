/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

/**
 * Create comment
 */

exports.create = function (req, res) {
    var image = req.image
    var user = req.user

    if (!req.body.comment) res.render('400');

    image.comments.push({
        body: req.body.comment,
        user: user._id
    });

    image.save(function (err) {
        if (err) return res.render('500');
        res.render('comments/comments.ect', {
            comments: image.comments
        });
    })
}
