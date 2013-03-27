
module.exports = {

    development: {
        app: {
            name: 'Imegerate dev'
        },
        port: 3000,
        root: require('path').normalize(__dirname + '/..'),
        mongo: { hostname: "localhost", port: 27017, username: "", password: "", name: "", db: "test" },
        google: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/google/callback"
        }
    },

    test: {

    },

    production: {
        app: {
            name: 'Imegerate'
        },
        port : process.env.VCAP_APP_PORT,
        root: require('path').normalize(__dirname + '/..')
    },

    buildMongoUrl: function(mongo) {
        if (!mongo) {
            var env = JSON.parse(process.env.VCAP_SERVICES);
            mongo = env['mongodb-1.8'][0]['credentials'];
        }

        mongo.hostname = (mongo.hostname || 'localhost');
        mongo.port = (mongo.port || 27017);
        mongo.db = (mongo.db || 'test');

        if(mongo.username && mongo.password){
            return "mongodb://" + mongo.username + ":" + mongo.password + "@" + mongo.hostname + ":" + mongo.port + "/" + mongo.db;
        }
        else{
            return "mongodb://" + mongo.hostname + ":" + mongo.port + "/" + mongo.db;
        }
    }

}

