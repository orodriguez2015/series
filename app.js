var express = require('express');
var partials = require('express-partials');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Se instala el middleware express-partials. Se instala después de definir
// el mecanismo de vistas y ejs de express-partials, sino no funciona.
// hay que crear en views, un archivo layout.ejs con la estructura que tendrán 
// todas las páginas
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
// Se pone extended a 'false', para poder enviar arrays en los formularios
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// Se instala el middleware y se indica el nombre utilizado para 
// encapsular el método POST por el que sea, en este caso suele ser por PUT.
// HTML5 no permite el envio de formularios por PUT, sólo por POST o por GET.
// De ahí que se haga esto
app.use(methodOverride('_method'));
//app.use(session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
