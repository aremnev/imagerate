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
    helpers = require('./helpers');

var loginer = new helpers.Loginer(request(app));

before(function (done) {
    helpers.resetDb(done);
});

describe('Images', function() {
    context('When logged in', function() {
        var locals = {};

        before(function (done) {
            loginer.login(done);
        });

        before(function(done) {
            Contest.findOne(function(err, contest) {
                locals.contest = contest;
                locals.contestId = contest._id.toString();
                done();
            });
        });

        it('POST /images with lack of parameters should respond with error message', function(done) {
            var req = request(app).post('/images');
            req.cookies = loginer.cookies;
            req
                .expect(400)
                .end(function(err, res) {
                    assert.ok(res.body.error);
                    done();
                });
        });

        it('POST /images with invalid file should respond with error message', function(done) {
            var req = request(app).post('/images');
            req.cookies = loginer.cookies;
            req
                .field('title', 'Fabulous Script')
                .field('contest[contest]', locals.contestId)
                .attach('image', './public/js/common.js')
                .expect(400)
                .end(function(err, res) {
                    assert.ok(res.body.error.image);
                    done();
                });
        });

        it('POST /images with proper parameters should respond with new image data', function(done) {
            var req = request(app).post('/images');
            req.cookies = loginer.cookies;
            req
                .field('title', 'Fabulous Image')
                .field('contest[contest]', locals.contestId)
                .attach('image', './public/img/google.png')
                .expect(200)
                .end(function(err, res) {
                    var data = res.body;
                    assert.ok(data.image);
                    assert.equal(data.image.title, 'Fabulous Image');
                    assert.equal(data.image.contest.contest, locals.contestId);
                    locals.image = data.image;
                    done();
                });
        });

        it('GET /images/:imageId for existing image should respond with Content-Type text/html', function (done) {
            var req = request(app).get('/images/' + locals.image._id);
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

//        it('DELETE ')
    });

    context('When not logged in', function () {
        it('POST: /images should respond with error message', function (done) {
            var req = request(app).post('/images');
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

        it('GET: /images/rated (json) should respond with images', function (done) {
            var req = request(app).get('/images/rated?json=1')
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

        it('GET: /images/rated with Content-Type text/html', function (done) {
            var req = request(app).get('/images/rated')
            req
                .expect(200)
                .end(function (err, res) {
                    done();
                });
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