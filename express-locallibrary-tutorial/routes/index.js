var express = require('express');
var router = express.Router();

const passport = require('passport');

// /* GET home page. */ ASI ESTABA ANTES DE ESCRIBIR EL LOGIN
// router.get('/', function (req, res) {
//   res.redirect("/catalog");
// });

router.get('/', function (req, res, next) {
  res.render('logindex');
});

router.get('/signup', function (req, res, next) {
  res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/catalog',
  failureRedirect: '/signup',
  passReqToCallback: true
})); 

router.get('/signin', function (req, res, next) {
  res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/catalog',
  failureRedirect: '/signin',
  passReqToCallback: true
}));

router.get('/catalog', checkAuthentication, (req, res, next) => {
  res.render('index');
});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/signin');
  });
});

// Si el usuario no está autenticado redirecciona a la pantalla de acceso. 
// Ejecutamos la funcion en cualquier ruta donde el acceso esté restringido.
function checkAuthentication (req, res, next){
  if(req.isAuthenticated()){
    next();
  } 
  res.redirect('/signin');
};

module.exports = router;
