/**
 * Module dependencies.
 */
var request = require('supertest'),
    assert = require('assert'),
    _ = require('underscore'),
    app = require(process.env.COVERAGE ? '../app-cov/app' : '../app/app'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    helpers = require('./helpers');

var loginer = new helpers.Loginer(request(app));

describe('Profile page', function () {
    context('When logged in', function () {
        before(function (done) {
            loginer.login(done);
        })
        it('GET: /user/:userId should respond with Content-Type text/html', function (done) {
            var req = request(app).get('/users/' + loginer.current._id)
            req.cookies = loginer.cookies
            req
                .expect(200)
                .end(function (err, res) {
                    done();
                });
        })

        it('GET: /user/:userId (json) should respond with Profile page data', function (done) {
            var req = request(app).get('/users/' + loginer.current._id + '?json=1')
            req.cookies = loginer.cookies
            req
                .expect(200)
                .end(function (err, res) {
                    var data = res.body;
                    assert.equal(data.extra.user._id, loginer.current._id);
                    assert.ok(data.contests.length);
                    assert.ok(data.extra.contests.length);
                    assert.ok(data.imagesResult.images.length);
                    done();
                });
        })
    })

    context('When not logged in', function () {
        it('GET: /user/:userId should redirect to Login page', function (done) {
            var req = request(app).get('/users/' + loginer.current._id + '?json=1')
            req
                .expect(302)
                .end(function (err, res) {
                    assert.ok(res.header['location'].indexOf('/login') + 1)
                    done();
                });
        })
    });
})