
var mongoose = require('mongoose');


module.exports = function (config) {

    config.db = buildMongoUrl(config.mongo);
    mongoose.connect(config.db);

    function buildMongoUrl(mongo) {
        if(process.env.MONGOLAB_URL) {
            return process.env.MONGOLAB_URL;
        }
        if (!mongo) {
            var env = JSON.parse(process.env.VCAP_SERVICES);
            mongo = env['mongodb-1.8'][0]['credentials'];
        }

        mongo.hostname = (mongo.hostname || 'localhost');
        mongo.port = (mongo.port || 27017);
        mongo.db = (mongo.db || 'test');

        if(mongo.username && mongo.password){
            return 'mongodb://' + mongo.username + ':' + mongo.password + '@' + mongo.hostname + ':' + mongo.port + '/' + mongo.db;
        }
        else{
            return 'mongodb://' + mongo.hostname + ':' + mongo.port + '/' + mongo.db;
        }
    }
}