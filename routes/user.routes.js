const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');
const md_auth = require('../middlewares/authentication');
const multipart = require('connect-multiparty');
const md_upload = multipart({uploadDir: './uploads/users/'});


//Rutas
router.get('/pruebas', md_auth.verifyToken, user.pruebas);
router.post('/register', user.createUser); //Crear usuario
router.post('/login', user.loginUser); //Iniciar sesión
router.put('/update-user/', md_auth.verifyToken, user.updateUser);
router.post('/upload-image-user/', [md_auth.verifyToken, md_upload], user.uploadImage);

module.exports = router;