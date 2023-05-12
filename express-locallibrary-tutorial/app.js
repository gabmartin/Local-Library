var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash'); // Mostrar mensajes entre paginas.

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog'); // Importar las rutas de la parte "Catálogo" de la web

var app = express();
require('./passport/local_auth');

// Configurar la conexion con mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
// Set up mongoose connection
const dev_db_url = "mongodb+srv://gabmartin:EEeV1@cluster0.djvfe48.mongodb.net/local_library?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || dev_db_url;

main().catch((err) => console.log(err));
async function main(){
  await mongoose.connect(mongoDB);
}

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Antes de inicializar passport tenemos que configurar la sesion con express-session
app.use(session({
  secret: 'mysecretsession',
  resave: false,
  saveUninitialized: false
}));
app.use(flash()); // Flash usa las sesiones, debe ir después. 
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.signinMessage = req.flash('signinMessage');

  next();
}); // Middleware para mostrar el mensaje de fallo del login en todas las vistas.

app.use((req, res, next) => {
  app.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter); // Añadir las rutas del catálogo a la cadena de middleware

// catch 404 y redirigir al handler de errores
app.use(function(req, res, next) {
  next(createError(404));
});

// handler de errores
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
