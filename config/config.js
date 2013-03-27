
module.exports = {
    development: {
        root: require('path').normalize(__dirname + '/..'),
        app: {
            name: 'Imegerate'
        },
        db: 'mongodb://localhost/:27017',
        google: {
            clientID: 'APP_ID',
            clientSecret: 'APP_SECRET',
            callbackURL: 'http://localhost:3000/auth/google/callback'
        }
    },
    test: {
        root: require('path').normalize(__dirname + '/..'),
        app: {
            name: 'Imegerate'
        },
        db: 'mongodb://localhost/:27017',
        google: {
            clientID: 'APP_ID',
            clientSecret: 'APP_SECRET',
            callbackURL: 'http://localhost:3000/auth/google/callback'
        }
    },
    production: {
        root: require('path').normalize(__dirname + '/..'),
        app: {
            name: 'Imegerate'
        },
        db: 'mongodb://localhost/:27017',
        google: {
            clientID: 'APP_ID',
            clientSecret: 'APP_SECRET',
            callbackURL: 'http://localhost:3000/auth/google/callback'
        }
    }
}
