/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Image = mongoose.model('Image'),
    async = require('async'),
    request = require('request'),
    fs = require('fs'),
    mime = require('express').mime,
    helpers = require('../helpers'),
    safe = helpers.safe;


/**
 * Find image by id
 */

exports.image = function(req, res, next, id){
    Image.load(id, function (err, image) {
        if (err || !image) {
            return res.status(404).render('404.ect');
        }
        req.image = image;
        next();
    })
}

exports.raw = function(req, res){
    var type = mime.lookup(req.image.image.cdnUri);
    var x = new request(req.image.image.cdnUri);
    x.pipe(res);
    x.on('response', function (response) {
        response.headers['content-type'] = type;
    });
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
                return res.status(500).render('500.ect', { err: err });
            }
            if (req.isAuthenticated()) {
                locals.image.addViewedByUser(req.user);
            }
            res.render('images/show.ect', locals);
        }
    );

    function populateLikes(callback) {
        Image.populate(req.image, opts, safe(callback, function(image) {
            var likes = image.contest.evaluations.slice(0, 20).map(function addProfileImage(ev) {
                var evAsObject = ev.toObject();
                evAsObject.user.image = res.locals.h.profileLink(32, ev.user);
                if (!helpers.isPastDate(req.image.contest.contest.dueDate)) {
                    evAsObject.rating = null;
                }

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
    var image = new Image({
        contest: {contest: req.contest},
        title: req.body.title
    })
    image.user = req.user;
    res.set('Content-Type', 'text/plain');
    if (req.body.url) {
        var download = function(uri, filename, cb){
            request.head(uri, function(err, res, body){
                if(err || !(res.headers['content-type'].indexOf('image') + 1)) {
                    return cb('Invalid image url');
                }

                var r = request(uri),
                    ws = fs.createWriteStream(filename);
                r.pipe(ws);
                r.on('end', function (err) {
                    if(err) {
                        return cb(err);
                    }
                    image.uploadAndSave(ws, function (err, savedImage) {
                        if (err) {
                            return cb(err.message || err.image);
                        }
                        return cb(null, savedImage);
                    });
                });
            });
        };
        download(req.body.url, '/tmp/filetmp', function(err, image) {
            if(err) {
                return res.send(400, err);
            }
            res.send(image._id);
        });
    } else {
        image.uploadAndSave(req.files.image, function (err, savedImage) {
            if (err) {
                return res.send(400, err.message || err.image);
            }
            res.send(savedImage._id);
        })
    }
}

/**
 * Remove image
 */

exports.remove = function (req, res) {
    var image = req.image
    if(helpers.isPastDate(image.contest.contest.dueDate)) {
        return res.send(403, {
            id: image._id,
            error: "Image of finished contest can't be removed."
        });
    }
    image.remove(function(err){
        res.send({ image: { _id: req.image._id, deleted: true }});
    })
}

function imageList(req, res, type) {
    var page = parseInt(req.param('page') > 0 ? req.param('page') : 1),
        perPage = 15;
    var soptions = {
        perPage: perPage,
        page: page - 1
    }
    var locals = {page: page}
    async.waterfall([
        function(cb) {
            Image.count({}, safe(cb, function(count) {
                locals.pages = Math.ceil(count / perPage);
            }))
        },
        function(count, cb) {
            if(count) {
                var options;
                switch (type) {
                    case 'viewed':
                        options = _.extend(soptions, {sort: {viewsCount: -1}});
                        locals.title = 'Most viewed photos';
                        break;
                    default:
                        options = soptions;
                        locals.title = 'Most recent photos';
                }
                Image.list(options, safe(cb, function(images) {
                    locals.images = images;
                }))
            } else {
                locals.images = [];
                cb();
            }
        }
    ],
    function(err) {
        if (err) {
            return req.render('500');
        }
        res.render('images/list.ect', locals);
    });
}

/**
 * Most rated image list
 */

exports.ratedList = function (req, res) {
    imageList(req, res, 'rated');
}

/**
 * Most recent image list
 */

exports.recentList = function (req, res) {
    imageList(req, res, 'recent');
}

/**
 * Most viewed image list
 */

exports.viewedList = function (req, res) {
    imageList(req, res, 'viewed');
}