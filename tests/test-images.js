/**
 * Module dependencies.
 */
var request = require('supertest'),
    assert = require('assert'),
    _ = require('underscore'),
    app = require(process.env.COVERAGE ? '../app-cov/app' : '../app/app'),
    mongoose = require('mongoose'),
    Image = mongoose.model('Image'),
    Contest = mongoose.model('Contest'),
    User = mongoose.model('User'),
    helpers = require('./helpers');


var loginer = new helpers.Loginer(request(app));

describe('Images', function() {
    context('When logged in', function() {
        var locals = {};

        before(function(done) {
            User
                .find()
                .limit(2)
                .exec(function(err, users) {
                    locals.user1 = users[0];
                    locals.user2 = users[1];
                    done();
                });
        });

        before(function (done) {
            loginer.login(done, locals.user1);
        });

        before(function(done) {
            Contest.findOne(function(err, contest) {
                locals.contest = contest;
                locals.contestId = contest._id.toString();
                done();
            });
        });

        it('POST /images with lack of parameters should respond with error message', function(done) {
            var req = request(app).post('/contests/' + locals.contestId +'/images');
            req.cookies = loginer.cookies;
            req
                .expect(400)
                .end(done);
        });

        it('POST /images with invalid file should respond with error message', function(done) {
            var req = request(app).post('/contests/' + locals.contestId +'/images');
            req.cookies = loginer.cookies;
            req
                .field('title', 'Fabulous Script')
                .attach('image', './public/js/common.js')
                .expect(400)
                .end(done);
        });

        it('POST /contests/:contestId/images with proper parameters should respond with new image data', function(done) {
            var req = request(app).post('/contests/' + locals.contestId +'/images');
            req.cookies = loginer.cookies;
            req
                .field('title', 'Fabulous Image')
                .attach('image', './public/img/google.png')
                .expect(200)
                .end(function(err, res) {
                    locals.image_id = res.text.replace(/"/g,'');
                    done();
                });
        });

        it('GET /images/:imageId for existing image should respond with Content-Type text/html', function (done) {
            var req = request(app).get('/images/' + locals.image_id);
            req.cookies = loginer.cookies;
            req
                .expect(200)
                .end(function (err, res) {
                    done();
                });
        });

        it('GET /images/:imageId for non-existent image should respond with NotFound error', function (done) {
            var req = request(app).get('/images/000011112222333344445555');
            req.cookies = loginer.cookies;
            req
                .expect(404)
                .end(function (err, res) {
                    done();
                });
        });

        it('DELETE /images/:imageId for arbitrary user should be forbidden', function(done) {
            loginer.login(function() {
                var req = request(app).del('/images/' + locals.image_id);
                req.cookies = loginer.cookies;
                req
                    .expect(403)
                    .end(function (err, res) {
                        assert.ok(res.body.error);
                        done();
                    });
            }, locals.user2);
        });

        it('DELETE /images/:imageId for image owner should respond with deletion confirmation', function(done) {
            loginer.login(function() {
                var req = request(app).del('/images/' + locals.image_id);
                req.cookies = loginer.cookies;
                req
                    .expect(200)
                    .end(function (err, res) {
                        var image = res.body.image;
                        assert.ok(image.deleted);
                        assert.equal(image._id, locals.image_id);
                        done();
                    });
            }, locals.user1);
        });
    });

    context('When not logged in', function () {
        var locals = {};

        before(function(done) {
            Contest.findOne(function(err, contest) {
                locals.contest = contest;
                locals.contestId = contest._id.toString();
                done();
            });
        });

        it('POST: /images should respond with error message', function (done) {
            var req = request(app).post('/contests/' + locals.contestId +'/images');
            req
                .expect(401)
                .end(function (err, res) {
                    assert.ok(res.header['location'].indexOf('/login') + 1)
                    done();
                });
        })

        it('GET: /images/recent (json) should respond with images', function (done) {
            var req = request(app).get('/images/recent?json=1')
            req
                .expect(200)
                .end(function (err, res) {
                    var data = res.body;
                    assert.ok(data.images.length);
                    assert.ok(data.pages);
                    assert.ok(data.page);
                    done();
                });
        })

        it('GET: /images/recent with Content-Type text/html', function (done) {
            var req = request(app).get('/images/recent')
            req
                .expect(200)
                .end(done);
        })

        it('GET: /images/viewed (json) should respond with images', function (done) {
            var req = request(app).get('/images/viewed?json=1')
            req
                .expect(200)
                .end(function (err, res) {
                    var data = res.body;
                    assert.ok(data.images.length);
                    assert.ok(data.pages);
                    assert.ok(data.page);
                    done();
                });
        })

        it('GET: /images/viewed with Content-Type text/html', function (done) {
            var req = request(app).get('/images/viewed')
            req
                .expect(200)
                .end(function (err, res) {
                    done();
                });
        })

        it('GET: /images/:imageId with Content-Type text/html', function (done) {
            Image.findOne({}, function(err, image) {
                var req = request(app).get('/images/' + image._id)
                req
                    .expect(200)
                    .end(function (err, res) {
                        done();
                    });
            });
        })

        it('GET: /images/:imageId (json) should respond with image data', function (done) {
            Image.findOne({}, function(err, image) {
                var req = request(app).get('/images/' + image._id + '?json=1')
                req
                    .end(function (err, res) {
                        var data = res.body;
                        assert.ok(data.image);
                        assert.ok(data.title);
                        assert.ok(data.likes);
                        assert.ok(!data.ratingByUser);
                        done();
                    });
            });
        })
    });
});