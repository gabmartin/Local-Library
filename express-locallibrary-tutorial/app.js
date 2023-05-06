var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog'); // Importar las rutas de la parte "Catálogo" de la web

var app = express();

// Configurar la conexion con mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = "mongodb+srv://gabmartin:EEeV1@cluster0.djvfe48.mongodb.net/local_library?retryWrites=true&w=majority";

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
