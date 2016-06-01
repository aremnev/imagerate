const CONFIG = {
    development: {
        app: {
            name: 'ImageRate - development'
        },
        log: 'dev',
        google: {
            clientID: '142945879228-b6iu505oas5ltj2hbcd7v5v3mvkr7vde.apps.googleusercontent.com',
            clientSecret: 'wx0gJWUohEps94SVzi6v0VTR',
            callbackURL: 'http://localhost:3000/auth/google/callback'
        },
        cloudinary: {
            cloud_name: 'imagerate-local',
            api_key: '451142758477939',
            api_secret: 'mz_x6GCybvpFlpFRF5phG4VN8fU'
        },
        admin: { regexp: '.*' }
    },

    test: {
        app: {
            name: 'ImageRate - testing'
        },
        mongo: { db: 'test-imagerate' },
        google: {
            clientID: '142945879228-b6iu505oas5ltj2hbcd7v5v3mvkr7vde.apps.googleusercontent.com',
            clientSecret: 'wx0gJWUohEps94SVzi6v0VTR',
            callbackURL: 'http://localhost:3000/auth/google/callback'
        },
        cloudinary: {
            cloud_name: 'imagerate-local',
            api_key: '451142758477939',
            api_secret: 'mz_x6GCybvpFlpFRF5phG4VN8fU'
        },
        admin: { regexp: '.*' },
        test: true
    },

    staging: {
        app: {
            name: 'ImageRate - staging'
        },
        cloudinary: {
            cloud_name: 'dvytjllqu',
            api_key: '312159288999829',
            api_secret: 'TrmB5kj4OzIP9cvXE9XWfhpxORg'
        },
        google: {
            clientID: '142945879228-b6iu505oas5ltj2hbcd7v5v3mvkr7vde.apps.googleusercontent.com',
            clientSecret: 'wx0gJWUohEps94SVzi6v0VTR',
            callbackURL: 'http://photo.dev.thumbtack.net:8080/auth/google/callback'
        }
    },

    production: {
        app: {
            name: 'ImageRate'
        },
        cloudinary: {
            cloud_name: 'dvytjllqu',
            api_key: '312159288999829',
            api_secret: 'TrmB5kj4OzIP9cvXE9XWfhpxORg'
        },
        google: {
            clientID: '142945879228-b6iu505oas5ltj2hbcd7v5v3mvkr7vde.apps.googleusercontent.com',
            clientSecret: 'wx0gJWUohEps94SVzi6v0VTR',
            callbackURL: 'http://photo.dev.thumbtack.net/auth/google/callback'
        }
    },

    default: {
        mongo: { hostname: 'localhost', port: 27017, username: '', password: '', name: '', db: 'imagerate' },
        port : process.env.PORT || process.env.VCAP_APP_PORT || 3000,
        root: require('path').normalize(__dirname + '/../..'),
        storage: {
            key: 'AKIAINXYBJLOQFJ66FIQ',
            secret: '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',
            bucket: 'net_thumbtack_contest'
        },
        google: {
            scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
        },
        admin: {
            emails: [
                'aremnev@thumbtack.net',
                'epashkevich@thumbtack.net',
                'mkolganov@thumbtack.net',
                'keremenko@thumbtack.net'
            ]
        }
    }
}

module.exports = function(env) {
    function deepMerge(target, source) {
        for (var key in source) {
            var original = target[key];
            var next = source[key];
            if (original && next && typeof next == "object") {
                deepMerge(original, next);
            } else {
                target[key] = next;
            }
        }
        return target;
    };
    return deepMerge(CONFIG.default, CONFIG[env]);
}
