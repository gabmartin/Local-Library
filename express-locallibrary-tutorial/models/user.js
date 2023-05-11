const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String
});

// Encriptar la contraseña para que no sea visible. Lo hacemos gracias a bcrypt:

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Comparar la contraseña que introduce el usuario con los datos que existen en la base de datos. 
// Para eso creamos una función propia que utilice la funcionalidad compareSync de bcrypt.

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Export model
const User = mongoose.model('User', userSchema);
module.exports = { User };