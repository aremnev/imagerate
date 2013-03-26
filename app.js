
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

var ECT = require('ect');
var ectRenderer = ECT({ watch: true, cache: false, root: __dirname + '/views', ext: '.ect' });
app.engine('.ect', ectRenderer.render);

// var port = process.env.PORT || 3000;
var port = process.env.VCAP_APP_PORT || 3000;

app.configure(function(){
  app.set('port', port);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
    res.render('index.ect', {title: 'Imagerate'}, null);
});

app.listen(port);
console.log('Listening on port ' + port);

