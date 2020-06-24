const userCtrl = {};
const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const moment = require("moment");
const jwtService = require('../services/jwt');
const fs = require('fs');
const path = require('path');

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
                            res.status(200).send({
                                token: jwtService.createToken(user)
                            });
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

userCtrl.updateUser = (req, res) => {
    var userId = req.query.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
        if(err) {
            res.status(500).send({
                message: 'Error al actualizar el usuario.'
            });
        }else {
            if(!userUpdated) {
                res.status(404).send({
                    message: 'No se ha podido actualizar el usuario.'
                });
            }else {
                //Va con el token antiguo esto deberia corregirlo
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

userCtrl.uploadImage = async(req, res) => {
    var userId = req.query.id;
    var file_name = 'No subido...';

    if(req.files) {
        var file_path = req.files.photo.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        console.log(file_name);
 
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, {photo: file_name}, {new: true}, (err, userUpdated) => {
                if(err) {
                    res.status(500).send({
                        message: 'Error al actualizar el usuario.'
                    });
                }else {
                    if(!userUpdated) {
                        res.status(200).send({
                            message: 'No se ha podido actualizar el usuario.'
                        });
                    }else {
                        res.status(200).send({photo: file_name, user: userUpdated});
                    }
                }
            });
        }else {
            res.status(200).send({
                message: 'Extensión del archivo no válido.'
            });
        }
    }else {
        res.status(200).send({
            message: 'No has subido ninguna imagen...'
        });
    }
}

userCtrl.getImageFile = (req, res) => {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, function(exists) {
        if(exists) {    
            res.sendFile(path.resolve(path_file));
        }else {
            res.status(200).send({
                message: 'No existe la imagen...'
            });
        }
    })
}

userCtrl.deleteUser = async (req, res) => {
    const numDeletedUsers = await User.count({email:{$regex : "deletedEmail.*"}});

    let userId = req.query.id;
    let update = { 
        name: null, 
        surname: null, 
        email: "deletedEmail"+numDeletedUsers,
        password: null,
        photo: null,
        leaving_date: new Date(),
        favs: null
     };

    try{
        const result = await User.findByIdAndUpdate(userId, update, {new: true}, (err, userDeleted) => {
            if(err) {
                res.status(500).send({
                    message: 'Error al borrar el usuario.'
                });
            }else {
                if(!userDeleted) {
                    res.status(404).send({
                        message: 'No se ha podido borrar el usuario.'
                    });
                }else {
                    //Va con el token antiguo esto deberia corregirlo
                    res.status(200).send({user: userDeleted});
                }
            }
        });    
    } catch (err){
        res.status(500).send(err.message);
    }
}


module.exports = userCtrl;