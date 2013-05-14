
/**
* Module dependencies.
*/

var express = require('express'),
    expressParams = require('express-params'),
    mongoStore = require('connect-mongo')(express),
    flash = require('connect-flash'),
    cloudinary = require('cloudinary'),
    helpers = require('../helpers'),
    subscribers = require('../subscribers');

module.exports = function (app, config, passport) {

    expressParams.extend(app);

    app.set('showStackError', true);
    if(config.log) {
        app.use(express.logger(config.log));
    }

    // set views path, template engine and default layout
    var ectRenderer = require('ect')({
        watch: false,
        cache: false,
        root: config.root + '/../views',
        ext: '.ect'
    });
    app.engine('.ect', ectRenderer.render);
    app.set('views', config.root + '/../views');

    app.configure(function () {
        // less should be placed before express.static
        app.use(require('less-middleware')({
            src: config.root + '/../public',
            compress: true
        }));
        app.use(express.static(config.root + '/../public'));

        // cookieParser should be above session
        app.use(express.cookieParser())

        // bodyParser should be above methodOverride
        app.use(express.bodyParser())
        app.use(express.methodOverride())

        // express/mongo session storage
        app.use(express.session({
            secret: 'secret_mongo',
            store: new mongoStore({
                url: config.db,
                collection : 'sessions'
            })
        }));

//        app.use(express.csrf());

        // connect flash for flash messages
        app.use(flash());

        // use passport session
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(express.favicon());

        //Config cloudinary
        cloudinary.config(config.cloudinary);

        // dynamic helpers
        app.use(helpers(config));
        app.use(subscribers(config));

        // routes should be at the last
        app.use(app.router);

        // assume "not found" in the error msgs
        // is a 404. this is somewhat silly, but
        // valid, you can do whatever you like, set
        // properties, use instanceof etc.
        app.use(function(err, req, res, next){
            // treat as 404
            if (~err.message.indexOf('not found')) return next()

            // log it
            console.error(err.stack)

            // error page
            res.status(500).render('500', { err: err.stack })
        })

        // assume 404 since no middleware responded
        app.use(function(req, res, next){
            res.status(404).render('404', { url: req.originalUrl, error: 'Not found' })
        })
    });
}
