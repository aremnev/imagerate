/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    async = require('async'),
    fs = require('fs'),
    User = mongoose.model('User'),
    Contest = mongoose.model('Contest'),
    Image = mongoose.model('Image');

/**
 * Clear database
 *
 * @param {Function} done
 */

exports.resetDb = function (done) {
    var data_path = './data';
    var data = []
    fs.readdirSync(data_path).forEach(function (file) {
        var obj = {
            model: file.replace('.json', ''),
            data: JSON.parse(fs.readFileSync(data_path + '/' + file, 'utf8'))
        }
        data.push(obj);
    });
    async.series([
        function (cb) {
            async.map([User, Contest, Image], dropCollection, function(err, res){
                cb();
            });
        },
        function (cb) {
            async.map(data, fillCollection, function(err, res){
                cb();
            });
        }
    ], function(err, res) {
        done();
    });
}

function dropCollection(model, cb) {
    model.remove({}, function() {
        cb();
    });
}

function fillCollection(data, cb) {
    async.map(data.data, addObject(data.model), function(err, res){
        cb();
    });
}

function addObject(model) {
    model = mongoose.model(model);
    return function(data, cb) {
        var obj = new model(data);
        obj.save(function(err, obj) {
            cb();
        });
    }
}

/**
 * Loginer
 * @param request
 * @constructor
 */
function Loginer(request) {
    this.request = request;
}

/*
 * @param done
 * @param user
 */
Loginer.prototype.login = function(done, user) {
    var obj = this;
    var request_call = function(obj, user){
        obj.request
            .post('/session')
            .field('email', user.email)
            .field('password', 'foobar')
            .end(function (err, res) {
                // store the cookie
                obj.cookies = res.headers['set-cookie'].pop().split(';')[0];
                obj.current = user;
                done()
            });
    }
    if(!user) {
        User.findOne({}, function(err, user){
            request_call(obj, user);
        })
    } else {
        request_call(obj, user);
    }
}

exports.Loginer = Loginer;