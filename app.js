'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar rutas
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Configurar cabeceras HTTP

//Rutas Base

app.get('/pruebas', (req, res) => {
    res.status(200).send({message: 'Primeras pruebas validas.'});
});

module.exports = app;