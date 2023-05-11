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

module.exports = router;
