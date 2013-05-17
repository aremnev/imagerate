/**
 * Module dependencies.
 */
var request = require('supertest'),
    assert = require('assert'),
    _ = require('underscore'),
    app = require(process.env.COVERAGE ? '../app-cov/app' : '../app/app'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
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
                .field('contest[contest]', locals.contest._id.toString())
                .attach('image', './public/js/common.js')
                .expect(400)
                .end(function(err, res) {
                    assert.ok(res.body.error.image);
                    done();
                });
        });
//
//        it('POST /images with proper parameters should respond with new image data', function(done) {
//            var req = request(app).post('/images');
//            req.cookies = loginer.cookies;
//            req
//                .field('title', 'Fabulous Image')
//                .field('contest[contest]', locals.contest._id)
//                .attach('file', 'public/img/google.png')
//                .expect(200)
//                .end(function(err, res) {
//                    var data = res.body;
//                    assert.ok(data.image);
//                    assert.equal(data.image.title, 'Fabulous Image');
//                    assert.equal(data.image.contest.contest, locals.contest._id);
//                    locals.image = data.image;
//                    done();
//                });
//        });
//    });
//
//    context('When not logged in', function () {
//        it('POST: /images should respond with error message', function (done) {
//            var req = request(app).post('/images');
//            req
//                .expect(401)
//                .end(function (err, res) {
//                    assert.ok(res.header['location'].indexOf('/login') + 1)
//                    done();
//                });
//        })
    });
});