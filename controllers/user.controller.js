const userCtrl = {};
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const moment = require("moment");

userCtrl.pruebas = (req, res) => {
    res.status(200).send({
        message: 'Probando...'
    });
};

userCtrl.createUser = async (req, res) => {
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        entry_date: req.body.entry_date,
        favs: [],
        photo: 'null'
    });

    if(req.body.password) {
        //Encriptar
        bcrypt.hash(req.body.password, null, null, (err, hash) => {
            user.password = hash;
            user.save((err, userStored) => {
                if(err) {
                    res.status(500).send({
                        message: 'Error al guardar el usuario.'
                    });
                }else {
                    if(!userStored) {
                        res.status(404).send({
                            message: 'No se ha registrado el usuario.'
                        });
                    }else {
                        res.status(200).send({user: userStored});
                    }
                }
            });
        });
    } else {
        res.status(200).send({
            message: 'Introduce la contraseña.'
        });
    }   
};

userCtrl.loginUser = async(req, res) => {
    var email = req.body.email;
    email = email.toLowerCase();
    var password = req.body.password;

    User.findOne({email: email}, (err, user) => {
        if(err) {
            res.status(500).send({
                message: 'Error en la petición.'
            });
        }else {
            if(!user) {
                res.status(404).send({
                    message: 'El usuario no existe.'
                });
            }else {
                //Comprobar la contraseña
                bcrypt.compare(password, user.password, (err, check) => {
                    
                    if(check) {
                        //Devolver los datos del usuario logueado
                        if(req.body.getHash) {
                            //Devolver un token de jwt
                        }else {
                            res.status(200).send({user});
                        }
                    }else {
                        res.status(404).send({
                            message: 'El usuario no ha podido loguearse.'
                        });
                    }
                });
            }
        }
    });
}


module.exports = userCtrl;