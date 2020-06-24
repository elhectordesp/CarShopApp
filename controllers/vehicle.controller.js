const vehicleCtrl = {};
const Vehicle = require('../models/vehicle');
const Client = require('../models/client');
const fs = require('fs');
const path = require('path');
const mongoosePagination = require('mongoose-pagination');

vehicleCtrl.getVehicles = async (req, res) => {
    if(req.query.page) {
        var page = req.query.page;
    }else {
        var page = 1;
    }
    var itemsPerPage = 3;

    Vehicle.find().sort('name').paginate(page, itemsPerPage, (err, vehicles, total) => {
        if(err) {
            res.status(500).send({
                message: 'Error en la petición.'
            });
        }else {
            if(!vehicles) {
                res.status(404).send({
                    message: 'No hay vehículos.'
                });
            }else {
                return res.status(200).send({
                    total: total,
                    vehicles: vehicles
                });
            }
        }
    });
}

vehicleCtrl.getVehicle = async (req, res) => {
    var vehicleId = req.query.id;

    Vehicle.findById(vehicleId, (err, vehicle) => {
        if(err) {
            res.status(500).send({
                message: 'Error en la petición.'
            });
        }else {
            if(!vehicle) {
                res.status(404).send({
                    message: 'El vehículo no existe.'
                });
            }else {
                res.status(200).send({vehicle});
            }
        }
    });
}

vehicleCtrl.createVehicle = async (req, res) => {
    const vehicle = new Vehicle({
        price: req.body.price,
        model: req.body.model,
        brand: req.body.brand,
        description: req.body.description,
        veh_type: req.body.veh_type,
        client: req.body.client,
        year: 'null',
        image: 'null'
    });

    if(req.body.year) {
        vehicle.year = req.body.year;
    }

    Client.findById(req.body.client, async (err, client) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar el vehículo.' });
        }
        else if (!client) res.status(404).send("No se ha encontrado el cliente introducido.");
        else {
            vehicle.save((err, vehicleStored) => {
                if(err) {
                    res.status(500).send({
                        err,
                        message: 'Error al guardar el vehículo.'
                    });
                }else {
                    if(!vehicleStored) {
                        res.status(404).send({
                            message: 'No se ha registrado el vehículo.'
                        });
                    }else {
                        res.status(200).send({vehicle: vehicleStored});
                    }
                }
            });
        }
    });    
}

vehicleCtrl.updateVehicle = (req, res) => {
    var vehicleId = req.query.id;
    var update = req.body;

    Vehicle.findByIdAndUpdate(vehicleId, update, (err, vehicleUpdated) => {
        if(err) {
            res.status(500).send({
                message: 'Error al actualizar el vehículo.'
            });
        }else {
            if(!vehicleUpdated) {
                res.status(404).send({
                    message: 'No se ha podido actualizar el vehículo.'
                });
            }else {
                res.status(200).send({vehicle: vehicleUpdated});
            }
        }
    });
}

vehicleCtrl.uploadImage = async (req, res) => {
    var vehicleId = req.query.id;
    var file_name = 'No subido...';

    if(req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Vehicle.findByIdAndUpdate(vehicleId, {image: file_name}, {new: true}, (err, vehicleUpdated) => {
                if(err) {
                    res.status(500).send({
                        message: 'Error al actualizar el vehículo.'
                    });
                }else {
                    if(!vehicleUpdated) {
                        res.status(200).send({
                            message: 'No se ha podido actualizar el vehículo.'
                        });
                    }else {
                        res.status(200).send({image: file_name, vehicle: vehicleUpdated});
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

vehicleCtrl.getImageFile = (req, res) => {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/vehicles/' + imageFile;

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

vehicleCtrl.deleteVehicle = async (req, res) => {
    let vehicleId = req.query.id;

    await Vehicle.findByIdAndDelete(vehicleId, (err, vehicleDeleted) => {
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

module.exports = vehicleCtrl;