/* Main application entry file. Please note, the order of loading is important.
 * Configuration loading and booting of controllers and custom error handlers */

require('./app/globals')();

var express = require('express'),
    fs = require('fs'),
    passport = require('passport');

// Load configurations
var env = process.env.NODE_ENV || 'development',
    config = require('./config/config'),
    cfg = config[env],
    auth = require('./config/middlewares/authorization')(cfg),
    mongoose = require('mongoose');

var port = cfg.port;

// Bootstrap db connection
cfg.db = config.buildMongoUrl(cfg.mongo);
mongoose.connect(cfg.db);

// Bootstrap models
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path + '/' + file)
})

// bootstrap passport config
require('./config/passport')(passport, cfg);

var app = express();
// express settings
require('./config/express')(app, cfg, passport);

// Initialize routes
require('./config/routes')(app, passport, auth, cfg);

// Start the app by listening on <port>
app.listen(port);
console.log('Express app started on port ' + port);
