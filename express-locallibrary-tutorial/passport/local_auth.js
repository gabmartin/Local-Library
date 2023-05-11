const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../models/user");

// Esto se ejecuta cuando termina done. Permite que las distintas paginas no necesiten loggearse.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Passport almacena los datos en el navegador y este los envia de vuelta al servidor.

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id); // Busca si existe el usuario en la base de datos.
  done(null, user);
});

// Creamos una funcion que define que hacer al recibir los datos del cliente.
// LocalStrategy recibe un objeto de configuracion y callback de ejecucion.
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, // almacena otros datos (direcciones, fechas...)
    },
    async (req, email, password, done) => {
      // Validar si existe un usuario con ese email antes de crearlo.
      const user = await User.findOne({ email: email });

      // Si recibe un usuario, el correo ya existe y devolvemos un mensaje de error.
      if (user) {
        return done(
          null,
          false,
          req.flash("signupMessage", "El email ya existe.")
        );
      } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password); // Recibe la contraseña, la cifra y la retorna dandosela al nuevo usuario.
        await newUser.save();
        done(null, newUser);
      }
    }
  )
);

passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(
          null,
          false,
          req.flash(
            "signinMessage",
            "No se ha encontrado ningun usuario con esos datos."
          )
        );
      }
      if (!user.comparePassword(password)) {
        return done(
          null,
          false,
          req.flash("signinMessage", "Contraseña incorrecta.")
        );
      }
      return done(null, user);
    }
  )
);
