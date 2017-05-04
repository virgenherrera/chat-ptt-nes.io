'use strict';
const express = sys.require('express');
const favicon = sys.require('serve-favicon');
const logger = sys.require('morgan');
// const cookieParser = require('cookie-parser');
const bodyParser = sys.require('body-parser');
const index = sys.require('/routes/index');
const users = sys.require('/routes/users');

const app = express();

// view engine setup
app.set('views', sys.dir.views);
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use( favicon( sys.path.join( sys.dir.public, 'favicon.ico') ) );
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(express.static( sys.dir.public ));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
