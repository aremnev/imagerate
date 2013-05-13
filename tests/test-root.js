
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

/**
 * Users tests
 */

var loginer = new helpers.Loginer(request(app));

before(function (done) {
    helpers.resetDb(done);
})

describe('Main page', function () {
    context('When not logged in', function () {
        it('GET: / should respond with Content-Type text/html', function (done) {
            var req = request(app).get('/')
            req.expect(200).end(done);
        })
        it('GET: / (json) should respond with data', function (done) {
            var req = request(app).get('/?json=1')
            req
                .expect(200)
                .end(function(err, res){
                    var data = res.body;
                    assert.ok(data.extra.contests.length);
                    assert.ok(_.isString(data.title));
                    assert.ok(data.images);
                    _.each(data.extra.contests, function(contest){
                        assert.ok(new Date(contest.dueDate).getTime() > new Date().getTime());
                    });
                    done();
                });
        })
    });
})

describe('Login page', function () {
    context('When not logged in', function () {
        it('GET: /login should respond with Content-Type text/html', function (done) {
            var req = request(app).get('/login')
            req
                .expect(200)
                .end(function (err, res) {
                    done();
                });
        })
    })

    context('When logged in', function () {
        before(function (done) {
            loginer.login(done);
        })
        it('GET: /login should redirect to Main page', function (done) {
            var req = request(app).get('/login')
            req.cookies = loginer.cookies;
            req
                .expect(302)
                .end(function (err, res) {
                    assert.equal('/', res.header['location'])
                    done();
                });
        })
    });
})

describe('Logout page', function () {
    context('When logged in', function () {
        it('GET: /logout should redirect to Login page', function (done) {
            var req = request(app).get('/logout')
            req
                .expect(200)
                .end(function (err, res) {
                    assert.equal('/login', res.header['location'])
                    done();
                });
        })
    })
    context('When not logged in', function () {
        before(function (done) {
            loginer.login(done);
        })
        it('GET: /logout should redirect to Login page', function (done) {
            var req = request(app).get('/logout')
            req.cookies = loginer.cookies;
            req
                .expect(302)
                .end(function (err, res) {
                    assert.equal('/login', res.header['location'])
                    done();
                });
        })
        it('GET: /user/:userId should redirect to Login page', function (done) {
            var req = request(app).get('/users/' + loginer.current._id);
            req.cookies = loginer.cookies;
            req
                .expect(302)
                .end(function (err, res) {
                    assert.ok(res.header['location'].indexOf('/login') + 1)
                    done();
                });
        })
    });
})