const mongoose = require('mongoose');
const eValidator = require('email-validator');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 20,
        required: [true, 'Debes introducir un nombre.']
    },
    surname: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: [true, 'Debes introducir un apellido.']
    },
    email: {
        type: String,
        required: [true, 'Debes introducir un correo electronico.']
    },
    password: {
        type: String,
        required: [true, 'Debes introducir una contraseña.']
    },
    photo: {
        type: String
    },
    entry_date: {
        type: Date,
        default: Date.now(),
        max: Date.now()
    },
    leaving_date: {
        type: Date,
        max: Date.now()
    },
    favs: {
        type: [String]
    }
});

userSchema.path('email').validate((email) => {
    return eValidator.validate(email.toString());
}, 'The email format is not valid');

module.exports = mongoose.model('User', userSchema);