
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

var ECT = require('ect');
var ectRenderer = ECT({ watch: true, cache: false, root: __dirname + '/views', ext: '.ect' });
app.engine('.ect', ectRenderer.render);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
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

app.listen(3000);
console.log('Listening on port 3000');

