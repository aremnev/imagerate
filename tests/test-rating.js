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

describe('Rating for images', function() {
    var locals = {};

    context('When logged in', function() {
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
            Image.findOne({}, function(err, image) {
                locals.image = image;
                done();
            });
        })

        it('POST /images/:imageId/rate/:rateValue should response with updated rating', function(done) {
            var url = ['/images', locals.image._id, 'rate', 4].join('/');
            var req = request(app).post(url);
            req.cookies = loginer.cookies;
            req
                .expect(200)
                .end(function(err, res) {
                    var data = res.body;
                    assert.equal(data.id, locals.image._id);
                    assert.equal(data.rating, 4);
                    done();
                });
        });

        it('POST /images/:imageId/rate/:rateValue twice should response with error message', function(done) {
            var url = ['/images', locals.image._id, 'rate', 4].join('/');
            var req = request(app).post(url);
            req.cookies = loginer.cookies;
            req
                .expect(403)
                .end(function(err, res) {
                    assert.ok(res.body.error);
                    done();
                });
        });

        it('POST /images/:imageId/rate/:rateValue for another user should response with updated rating', function(done) {
            loginer.login(function() {
                var url = ['/images', locals.image._id, 'rate', 5].join('/');
                var req = request(app).post(url);
                req.cookies = loginer.cookies;
                req
                    .expect(200)
                    .end(function(err, res) {
                        var data = res.body;
                        assert.equal(data.id, locals.image._id);
                        assert.equal(data.rating, 9);
                        assert.equal(data.newLike.user._id, locals.user2._id);
                        done();
                    });
            }, locals.user2);
        });
    });

    context('When not logged in', function () {
        it('POST: /images/:imageId/rate/:rateValue should respond with error message', function (done) {
            var url = ['/images', locals.image._id, 'rate', 4].join('/');
            var req = request(app).post(url);
            req
                .expect(401)
                .end(function (err, res) {
                    assert.ok(res.header['location'].indexOf('/login') + 1);
                    done();
                });
        })
    });
});