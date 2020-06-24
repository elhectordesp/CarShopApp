const clientCtrl = {};
const Client = require('../models/client');
const Vehicle = require('../models/vehicle');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt-nodejs');
const jwtService = require('../services/jwt');

clientCtrl.createClient = async (req, res) => {
    const client = new Client({
        email: req.body.email,
        name: req.body.name,
        city: req.body.city,
        logo: 'null'
    });

    if(req.body.password) {
        console.log('entro');
        //Encriptar
        bcrypt.hash(req.body.password, null, null, (err, hash) => {
            client.password = hash;
            client.save((err, clientStored) => {
                if(err) {
                    console.log(err);
                    res.status(500).send({
                        message: 'Error al guardar el cliente.'
                    });
                }else {
                    if(!clientStored) {
                        res.status(404).send({
                            message: 'No se ha registrado el cliente.'
                        });
                    }else {
                        res.status(200).send({client: clientStored});
                    }
                }
            });
        });
    }else {
        res.status(200).send({
            message: 'Introduce la contraseña.'
        });
    }
}

clientCtrl.loginClient = async (req, res) => {
    var email = req.body.email;
    email = email.toLowerCase();
    var password = req.body.password;

    Client.findOne({email: email}, (err, client) => {
        if(err) {
            res.status(500).send({
                message: 'Error en la petición.'
            });
        }else {
            if(!client) {
                res.status(404).send({
                    message: 'El cliente no existe.'
                });
            }else {
                //Comprobar la contraseña
                bcrypt.compare(password, client.password, (err, check) => {
                    
                    if(check) {
                        //Devolver los datos del usuario logueado
                        if(req.body.getHash) {
                            //Devolver un token de jwt
                            res.status(200).send({
                                token: jwtService.createTokenCli(client)
                            });
                        }else {
                            res.status(200).send({client});
                        }
                    }else {
                        res.status(404).send({
                            message: 'El cliente no ha podido loguearse.'
                        });
                    }
                });
            }
        }
    });
}

clientCtrl.updateClient = (req, res) => {
    var clientId = req.query.id;
    var update = req.body;

    Client.findByIdAndUpdate(clientId, update, {new: true}, (err, clientUpdated) => {
        if(err) {
            res.status(500).send({
                message: 'Error al actualizar el cliente.'
            });
        }else {
            if(!clientUpdated) {
                res.status(404).send({
                    message: 'No se ha podido actualizar el cliente.'
                });
            }else {
                //Va con el token antiguo esto deberia arreglarlo
                res.status(200).send({client: clientUpdated});
            }
        }
    });
}

clientCtrl.uploadImage = async(req, res) => {
    var clientId = req.query.id;
    var file_name = 'No subido...';

    if(req.files) {
        var file_path = req.files.logo.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Client.findByIdAndUpdate(clientId, {logo: file_name}, {new: true}, (err, clientUpdated) => {
                if(err) {
                    res.status(500).send({
                        message: 'Error al actualizar el cliente.'
                    });
                }else {
                    if(!clientUpdated) {
                        res.status(200).send({
                            message: 'No se ha podido actualizar el cliente.'
                        });
                    }else {
                        res.status(200).send({logo: file_name, client: clientUpdated});
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

clientCtrl.getImageFile = (req, res) => {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/clients/' + imageFile;

    fs.exists(path_file, function(exists) {
        if(exists) {
            res.sendFile(path.resolve(path_file));
        }else {
            res.status(200).send({
                message: 'No existe la imagen...'
            });
        }
    });
}

clientCtrl.deleteClient = async (req, res) => {
    const numDeletedUsers = await Client.count({email:{$regex : "deletedEmail.*"}});

    let clientId = req.query.id;

    let update = { 
        name: null, 
        email: "deletedEmail"+numDeletedUsers,
        password: null,
        logo: null,
        city: null
    };

    try{
        const result = await Client.findByIdAndUpdate(clientId, update, {new: true}, (err, clientDeleted) => {
            if(err) {
                res.status(500).send({
                    message: 'Error al borrar el cliente.'
                });
            }else {
                if(!clientDeleted) {
                    res.status(404).send({
                        message: 'No se ha podido borrar el cliente.'
                    });
                }else {
                    Vehicle.find({client: clientDeleted._id}).remove((err, vehicleDeleted) => {
                        if(err) {
                            res.status(500).send({
                                message: 'Error al borrar el vehículo.'
                            });
                        }else {
                            if(!vehicleDeleted) {
                                res.status(404).send({
                                    message: 'No se ha podido borrar el vehículo.'
                                });
                            }else {
                                //Va con el token antiguo esto deberia corregirlo
                                res.status(200).send({vehicle: vehicleDeleted});
                            }
                        }
                    });
                }
            }
        });    
    } catch (err){
        res.status(500).send(err.message);
    }
}

module.exports = clientCtrl;