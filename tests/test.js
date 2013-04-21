
/**
 * Module dependencies.
 */
var request = require('supertest'),
    app = process.env.COVERAGE
        ? require('../app-cov/app')
        : require('../app/app');

describe('GET /', function () {
    it('Status should be 200', function (done) {
        request(app)
            .get('/')
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    })
})

describe('GET /login', function () {
    it('Status should be 200', function (done) {
        request(app)
            .get('/login')
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    })
})

describe('GET /logout', function () {
    it('Status should be 200', function (done) {
        request(app)
            .get('/logout')
            .end(function(err, res){
                res.header['location'].should.include('/')
                done();
            });
    })
})
