const mongoose = require('mongoose');
const eValidator = require('email-validator');

const { Schema } = mongoose;

const clientSchema = new Schema({
    email: {
        type: String,
        required: [true, "Debes introducir un correo electrónico."]
    },
    logo: {
        type: String,
        required: false
      },
      city: {
        type: String,
        minlength: 1,
        maxlength: 58,
        required: [true, "Debes introducir una ciudad."]
      },
      name: {
          type: String,
          minlength: 3,
          maxlength: 60,
          required: [true, 'Debes introducir un nombre de empresa.']
      }
});

clientSchema.path('email').validate((email) => {
    return validator.validate(email.toString());
  }, "Este formato de correo electrónico no es valido.");

  module.exports = mongoose.model('Client', clientSchema);