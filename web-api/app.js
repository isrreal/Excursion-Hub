var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var excursoesRouter = require('./routes/excursoes.routes.js');
var userRouter = require('./routes/user.routes.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'sua-frase-super-secreta-aqui',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

// Middleware para verificar se o usuário está logado
app.use((req, res, next) => {
    const publicRoutes = ['/login.html', '/register.html', '/stylesheets/', '/javascripts/login.js', '/javascripts/register.js'];
    const isApiRoute = req.path.startsWith('/api/users/login') || req.path.startsWith('/api/users/register');
    const isPublic = publicRoutes.some(path => req.path.startsWith(path));

    // Permite acesso irrestrito às rotas públicas e de API de login/registro
    if (isPublic || isApiRoute) {
        return next();
    }
    
    // Se a rota não for pública e o usuário não estiver logado, redireciona para o login
    if (!req.session.user) {
        return res.redirect('/login.html');
    }
    
    next();
});

// As rotas agora são declaradas DEPOIS da sessão estar pronta
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', excursoesRouter);
app.use('/api/users', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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