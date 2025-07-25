var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var excursoesRouter = require('./routes/excursoes.routes.js');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/criar-excursao', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'criar-excursao.html'));
});

app.get('/viagem-content', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viagem-content.html'));
});

app.use('/api', excursoesRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({
      status: err.status || 500,
      message: err.message,
      error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;