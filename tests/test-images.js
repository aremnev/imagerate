/**
 * Module dependencies.
 */
var request = require('supertest'),
    assert = require('assert'),
    _ = require('underscore'),
    app = require(process.env.COVERAGE ? '../app-cov/app' : '../app/app'),
    mongoose = require('mongoose'),
    Image = mongoose.model('Image'),
    helpers = require('./helpers');

var loginer = new helpers.Loginer(request(app));

describe('Image pages', function () {
    context('When not logged in', function () {
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