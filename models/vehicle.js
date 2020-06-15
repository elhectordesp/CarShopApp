const mongoose = require('mongoose');
const { Schema } = mongoose;

const vehicleSchema = new Schema({
    price: {
        type: Number,
        required: [true, 'Debes introducir un precio.']
    },
    model: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: [true, 'Debes introducir el modelo del vehiculo.']
    },
    brand: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: [true, 'Debes introducir la marca del vehiculo.']
    },
    year: {
        type: String,
        minlength: 4,
        maxlength: 4
    },
    image: {
        type: String
    },
    description: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: [true, 'Debes introducir una descripcion para el vehiculo.']
    },
    veh_type: {
        type: String,
        enum: {
            values: ["Car", "Motorbike"],
            message: "Debes introducir un tipo de vehiculo valido; Por ahora los tipos de vehiculo son Car o Motorbike."
        },
        required: [true, "Debes introducir un tipo de vehiculo."]
    }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);