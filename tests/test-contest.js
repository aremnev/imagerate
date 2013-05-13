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

before(function (done) {
    helpers.resetDb(done);
})

describe('Contests pages', function () {
    context('When logged in', function () {
        before(function (done) {
            loginer.login(done);
        })
        it('POST: /contests without fields should respond with error message', function (done) {
            var req = request(app).post('/contests')
            req.cookies = loginer.cookies
            req
                .expect(401)
                .end(function (err, res) {
                    assert.ok(res.body.message);
                    done();
                });
        })

        var contest;

        it('POST: /contests should respond with new contest data', function (done) {
            var req = request(app).post('/contests')
            req.cookies = loginer.cookies
            req
                .field('title', 'Another one contest')
                .field('description', 'Description for another one contest')
                .expect(200)
                .end(function (err, res) {
                    var data = res.body;
                    assert.ok(data.contest);
                    assert.equal(data.contest.title, 'Another one contest');
                    assert.equal(data.contest.description, 'Description for another one contest');
                    contest = data.contest;
                    done();
                });
        })

        it('POST: /contests/:contestId should respond with updated contest data', function (done) {
            var req = request(app).post('/contests/' + contest._id)
            req.cookies = loginer.cookies
            req
                .field('title', 'Another one contest updated')
                .field('description', 'Description for another one contest updated')
                .expect(200)
                .end(function (err, res) {
                    var data = res.body;
                    assert.ok(data.contest);
                    assert.equal(data.contest.title, 'Another one contest updated');
                    assert.equal(data.contest.description, 'Description for another one contest updated');
                    contest = data.contest;
                    done();
                });
        })
    })

    context('When not logged in', function () {
        it('POST: /contests without fields should respond with error message', function (done) {
            var req = request(app).post('/contests')
            req
                .expect(302)
                .end(function (err, res) {
                    assert.ok(res.header['location'].indexOf('/login') + 1)
                    done();
                });
        })
    });
})