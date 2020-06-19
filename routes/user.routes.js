const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');


//Rutas
router.get('/pruebas', user.pruebas);
router.post('/register', user.createUser); //Crear usuario
router.post('/login', user.loginUser); //Iniciar sesión

module.exports = router;