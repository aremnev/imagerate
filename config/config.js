
module.exports = {

    development: {
        app: {
            name: 'Imagerate dev'
        },
        port: 3000,
        root: require('path').normalize(__dirname + '/..'),
        mongo: { hostname: 'localhost', port: 27017, username: '', password: '', name: '', db: 'test' },
        google: {
            clientID: '163368963370.apps.googleusercontent.com',
            clientSecret: 'rSsPMMP6MyWsIcnW6ksTg2dR',
            callbackURL: 'http://localhost:3000/auth/google/callback',
            scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
            photoLink: 'https://lh4.googleusercontent.com/-LnOLxLmyDbM/AAAAAAAAAAI/AAAAAAAAAAA/VYIuGGjpm4o/s{0}-c/photo.jpg'
        },
        cloudinary: {
            cloud_name: 'imagerate-local',
            api_key: '451142758477939',
            api_secret: 'mz_x6GCybvpFlpFRF5phG4VN8fU'
        },
        admin: { regexp: '.*' }
    },

    test: {

    },

    production: {
        app: {
            name: 'Imagerate'
        },
        port : process.env.VCAP_APP_PORT,
        root: require('path').normalize(__dirname + '/..'),
        mongo: { hostname: 'localhost', port: 27017, username: '', password: '', name: '', db: 'test' },
        google: {
            clientID: '163368963370-5qcnvj9oorl0cjmn5noi8jpj0tgriid9.apps.googleusercontent.com',
            clientSecret: '3WsFl4iXUpI4KyrqZi7fp6ZU',
            callbackURL: 'https://imagerate.ap01.aws.af.cm/auth/google/callback',
            scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
            photoLink: 'https://lh4.googleusercontent.com/-LnOLxLmyDbM/AAAAAAAAAAI/AAAAAAAAAAA/VYIuGGjpm4o/s{0}-c/photo.jpg'
        },
        cloudinary: {
            cloud_name: 'imagerate-local',
            api_key: '451142758477939',
            api_secret: 'mz_x6GCybvpFlpFRF5phG4VN8fU'
        },
        admin: {
            emails: [
                'dsedelnikov@thumbtack.net',
                'dmnorc@gmail.com',
                'aremnev@thumbtack.net'
            ]
        }
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
            return 'mongodb://' + mongo.username + ':' + mongo.password + '@' + mongo.hostname + ':' + mongo.port + '/' + mongo.db;
        }
        else{
            return 'mongodb://' + mongo.hostname + ':' + mongo.port + '/' + mongo.db;
        }
    }

}

