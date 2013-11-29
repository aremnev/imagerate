var knox = require('knox');

var client;

exports.instance = function () {
    return client;
}

exports.config = function(config) {
    if(!config.test) {
        client = knox.createClient(config.storage);
    }
};