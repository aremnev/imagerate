/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Contest = mongoose.model('Contest'),
     _ = require('underscore'),
     Q = require('q');


function subscribers (cfg) {

    var queue = [
        function (req, res, next) {
            var deferred = Q.defer();
            var options = {perPage: 5};
            Contest.list(options, function(err, contests){
                res.locals.extra = res.locals.extra || {}
                res.locals.extra.contests = contests;
                deferred.resolve(true);
            });
            // return promise to resolve deferred call
            return deferred.promise;
        }
    ]

    return function(req, res, next) {

        var promises = [];

        // Add functions to promises
        _.each(queue, function(f){
            promises.push(Q.fcall(f, req, res, next));
        });

        // Q.all: execute an array of 'promises'
        Q.all(promises).then(function(results) {
            // all deferred are resolved
            next();
        });
    }
}

module.exports = subscribers;