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
    var data_path = './data/collections';
    var data = []
    fs.readdirSync(data_path).forEach(function (file) {
        var obj = {
            model: file.replace('.json', ''),
            data: JSON.parse(fs.readFileSync(data_path + '/' + file, 'utf8'))
        }
        data.push(obj);
    });
    async.waterfall([
        function (cb) {
            async.map([User, Contest, Image], dropCollection, function(err, res){
                cb();
            });
        },
        function (cb) {
            async.map(data, fillCollection, function(err, res){
                cb(null, res);
            });
        },
        function (data, cb) {
            var objects = {};
            _.each(data, function(result) {
                objects[result.model] = result.results;
            });
            async.map(objects.User, addPhotos(objects.Contest), function(err, res){
                objects.Image = res;
                cb(null, objects);
            });
        }
    ], function(err, res) {
        done();
    });
}

function dropCollection(model, done) {
    // Should use this instead model.remove({}, cb)
    // This is calls hooks for remove action
    model.find({}, function(err, list) {
        function removeObj(obj, cb) {
            obj.remove(function(err) {
                cb();
            });
        }
        async.map(list, removeObj, function(err, res){
            done();
        });
    });
}

function fillCollection(data, cb) {
    async.map(data.data, addObject(data.model), function(err, res){
        cb(null, {'model': data.model, 'results': res});
    });
}

function addObject(model) {
    model = mongoose.model(model);
    return function(data, cb) {
        var obj = new model(data);
        obj.save(function(err, obj) {
            cb(null, obj);
        });
    }
}

function addPhotos(contests) {
    var files = []
    var images_path =  './data/images';
    fs.readdirSync(images_path).forEach(function (file) {
        files.push({path: images_path + '/' + file});
    })
    return function(user, cb) {
        var image = new Image({
            contest: {contest: contests[0]._id},
            title: 'File ' + user.name
        })
        image.user = user;
        image.uploadAndSave(files[0], function(err, image) {
            cb(null, image);
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