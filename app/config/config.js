
module.exports = {
    development: {
        app: {
            name: 'ImageRate - development'
        },
        log: 'dev',
        port: 3000,
        root: require('path').normalize(__dirname + '/..'),
        mongo: { hostname: 'localhost', port: 27017, username: '', password: '', name: '', db: 'dev-imagerate' },
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
        storage: {
            key: 'AKIAINXYBJLOQFJ66FIQ',
            secret: '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',
            bucket: 'net_thumbtack_contest'
        },
        admin: { regexp: '.*' }
    },

    test: {
        app: {
            name: 'ImageRate - testing'
        },
        port: 88654,
        root: require('path').normalize(__dirname + '/..'),
        mongo: { hostname: 'localhost', port: 27017, username: '', password: '', name: '', db: 'test-imagerate' },
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
        storage: {
            key: 'AKIAINXYBJLOQFJ66FIQ',
            secret: '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',
            bucket: 'net_thumbtack_contest'
        },
        admin: { regexp: '.*' },
        test: true
    },

    staging: {
        app: {
            name: 'ImageRate - staging'
        },
        port : process.env.VCAP_APP_PORT,
        root: require('path').normalize(__dirname + '/..'),
        mongo: { hostname: 'localhost', port: 27017, username: '', password: '', name: '', db: 'imagerate' },
        google: {
            clientID: '163368963370-5qcnvj9oorl0cjmn5noi8jpj0tgriid9.apps.googleusercontent.com',
            clientSecret: '3WsFl4iXUpI4KyrqZi7fp6ZU',
            callbackURL: 'https://contest-app.aws.af.cm/auth/google/callback',
            scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
            photoLink: 'https://lh4.googleusercontent.com/-LnOLxLmyDbM/AAAAAAAAAAI/AAAAAAAAAAA/VYIuGGjpm4o/s{0}-c/photo.jpg'
        },
        storage: {
            key: 'AKIAINXYBJLOQFJ66FIQ',
            secret: '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',
            bucket: 'net_thumbtack_contest'
        },
        admin: {
            emails: [
                'dsedelnikov@thumbtack.net',
                'dmnorc@gmail.com',
                'aremnev@thumbtack.net',
                'pulyashev@thumbtack.net',
                'ashipovalov@thumbtack.net',
                'epashkevich@thumbtack.net'
            ]
        }
    },

    production: {
        app: {
            name: 'ImageRate'
        },
        port : process.env.VCAP_APP_PORT,
        root: require('path').normalize(__dirname + '/..'),
        mongo: { hostname: 'localhost', port: 27017, username: '', password: '', name: '', db: 'imagerate-production' },
        google: {
            clientID: '163368963370-3reqk668cm11vfc3td5rqc2603knb5ca.apps.googleusercontent.com',
            clientSecret: 'yCH74X40e4-mERo4CkNxk3d3',
            callbackURL: 'https://imagerate.ap01.aws.af.cm/auth/google/callback',
            scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
            photoLink: 'https://lh4.googleusercontent.com/-LnOLxLmyDbM/AAAAAAAAAAI/AAAAAAAAAAA/VYIuGGjpm4o/s{0}-c/photo.jpg'
        },
        storage: {
            key: 'AKIAINXYBJLOQFJ66FIQ',
            secret: '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',
            bucket: 'net_thumbtack_contest'
        },
        admin: {
            emails: [
                'dsedelnikov@thumbtack.net',
                'dmnorc@gmail.com',
                'aremnev@thumbtack.net',
                'pulyashev@thumbtack.net',
                'ashipovalov@thumbtack.net',
                'epashkevich@thumbtack.net'
            ]
        }
    }
}

