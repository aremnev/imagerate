
/**
 * Module dependencies.
 */
var request = require('supertest'),
    assert = require('assert'),
    app = process.env.COVERAGE
        ? require('../app-cov/app')
        : require('../app/app');

describe('', function () {
    it('Status should be 200', function (done) {
        request(app)
            .get('/?json=1')
            .end(function(err, res){
                var result = res.body;
                assert.ok(result.images);
                assert.ok(result.extra.contests);
                res.should.have.status(200);
                done();
            });
    })
})

describe('', function () {
    it('Status should be 200', function (done) {
        request(app)
            .get('/login?json=1')
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it('should login', function (done) {
        request(app)
            .post('/session')
            .send({email: 'test@thumbtack.net'})
            .end(function(err, res){
                res.should.have.status(302);
                console.log(res.body);
                res.header['location'].should.include('/');
                done();
            });
    });
})

describe('', function () {
    it('Status should be 200', function (done) {
        request(app)
            .get('/logout')
            .end(function(err, res){
                res.header['location'].should.include('/')
                done();
            });
    })
})
