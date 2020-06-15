'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/api', (err, res) => {
    if(err) {
        throw err;
    }else {
        console.log('Base de datos corriendo.');

        app.listen(port, function() {
            console.log('Servidor del api escuchando en http://localhost:'+port);
        })
    }
});