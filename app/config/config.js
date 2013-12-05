const CONFIG = {
    development: {
        app: {
            name: 'ImageRate - development'
        },
        log: 'dev',
        google: {
            clientID: '163368963370.apps.googleusercontent.com',
            clientSecret: 'rSsPMMP6MyWsIcnW6ksTg2dR',
            callbackURL: 'http://localhost:3000/auth/google/callback'
        },
        cloudinary: {
            cloud_name: 'imagerate-local',
            api_key: '451142758477939',
            api_secret: 'mz_x6GCybvpFlpFRF5phG4VN8fU'
        }
    },

    test: {
        app: {
            name: 'ImageRate - testing'
        },
        mongo: { db: 'test-imagerate' },
        google: {
            clientID: '163368963370.apps.googleusercontent.com',
            clientSecret: 'rSsPMMP6MyWsIcnW6ksTg2dR',
            callbackURL: 'http://localhost:3000/auth/google/callback'
        },
        cloudinary: {
            cloud_name: 'imagerate-local',
            api_key: '451142758477939',
            api_secret: 'mz_x6GCybvpFlpFRF5phG4VN8fU'
        },
        test: true
    },

    staging: {
        app: {
            name: 'ImageRate - staging'
        },
        google: {
            clientID: '163368963370-5qcnvj9oorl0cjmn5noi8jpj0tgriid9.apps.googleusercontent.com',
            clientSecret: '3WsFl4iXUpI4KyrqZi7fp6ZU',
            callbackURL: 'https://contest-app.aws.af.cm/auth/google/callback'
        }
    },

    production: {
        app: {
            name: 'ImageRate'
        },
        google: {
            clientID: '163368963370-3reqk668cm11vfc3td5rqc2603knb5ca.apps.googleusercontent.com',
            clientSecret: 'yCH74X40e4-mERo4CkNxk3d3',
            callbackURL: 'http://photo.dev.thumbtack.net/auth/google/callback'
        }
    },

    herokuStaging: {
        app: {
            name: 'ImageRate - staging'
        },
        google: {
            clientID: '89333681933.apps.googleusercontent.com',
            clientSecret: 'adhsgM9WHKGp5iYgU8Zr9wsp',
            callbackURL: 'https://thumbtack-imagerate.herokuapp.com/auth/google/callback'
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
            scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
            photoLink: 'https://profiles.google.com/s2/photos/profile/{0}?sz={1}',
            photoPlaceholder : '/img/user_{0}.png'
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

