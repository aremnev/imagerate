/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    async = require('async'),
    fs = require('fs'),
    User = mongoose.model('User');

/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */

exports.resetDb = function (done) {
    var data_path = './data';
    var data = {}
    fs.readdirSync(data_path).forEach(function (file) {
        data[file.replace('.json', '')] = JSON.parse(fs.readFileSync(data_path + '/' + file, 'utf8'));
    });

    async.series([
        function (cb) {
            User.remove({}, function(err, res) {
                cb();
            });
        },
        function (cb) {
            async.map(data.User, addObject(User), function(err, res){
                cb();
            });
        }
    ], function(err, res) {
        done();
    });
}

function addObject(model) {
    return function(obj, cb) {
        obj = new model(obj);
        obj.save(function(err, obj) {
            cb();
        });
    }
}