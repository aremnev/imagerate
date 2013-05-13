
/**
 * Module dependencies.
 */
var request = require('supertest'),
    assert = require('assert'),
    app = require(process.env.COVERAGE ? '../app-cov/app' : '../app/app'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    helpers = require('./helpers');

var cookies, current;

/**
 * Users tests
 */

before(function (done) {
    helpers.resetDb(done);
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
            login(done);
        })
        it('GET: /login should redirect to Main page', function (done) {
            var req = request(app).get('/login')
            req.cookies = cookies;
            req
                .expect(302)
                .end(function (err, res) {
                    assert.equal('/', res.header['location'])
                    done();
                });
        })
    });
})

describe('Profile page', function () {
    context('When not logged in', function () {
        it('GET: /user/:userId should redirect to Login page', function (done) {
            var req = request(app).get('/users/' + current._id + '?json=1')
            req
                .expect(302)
                .end(function (err, res) {
                    assert.ok(res.header['location'].indexOf('/login') + 1)
                    done();
                });
        })
    });

    context('When logged in', function () {
        before(function (done) {
            login(done);
        })

        it('GET: /user/:userId should respond with Content-Type text/html', function (done) {
            var req = request(app).get('/users/' + current._id)
            req.cookies = cookies
            req
                .expect(200)
                .end(function (err, res) {
                    done();
                });
        })

        it('GET: /user/:userId (json) should respond with Profile page data', function (done) {
            var req = request(app).get('/users/' + current._id + '?json=1')
            req.cookies = cookies
            req
                .expect(200)
                .end(function (err, res) {
                    var data = res.body;
                    assert.equal(data.extra.user._id, current._id);
                    assert.ok(data.contests);
                    assert.ok(data.images);
                    done();
                });
        })
    })
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
            login(done);
        })
        it('GET: /logout should redirect to Login page', function (done) {
            var req = request(app).get('/logout')
            req.cookies = cookies;
            req
                .expect(302)
                .end(function (err, res) {
                    assert.equal('/login', res.header['location'])
                    done();
                });
        })
        it('GET: /user/:userId should redirect to Login page', function (done) {
            var req = request(app).get('/users/' + current._id);
            req.cookies = cookies
            req
                .expect(302)
                .end(function (err, res) {
                    assert.ok(res.header['location'].indexOf('/login') + 1)
                    done();
                });
        })
    });
})

function login(done, user) {
    // login the user
    var request_call = function(user){
        request(app)
            .post('/session')
            .field('email', user.email)
            .field('password', 'foobar')
            .end(function (err, res) {
                // store the cookie
                cookies = res.headers['set-cookie'].pop().split(';')[0];
                current = user;
                done()
            });
    }
    if(!user) {
        User.findOne({}, function(err, user){
            request_call(user);
        })
    } else {
        request_call(user);
    }
}
