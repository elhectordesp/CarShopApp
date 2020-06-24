const express = require('express');
const router = express.Router();
const client = require('../controllers/client.controller');
const md_auth = require('../middlewares/authentication');
const multipart = require('connect-multiparty');
const md_upload = multipart({uploadDir: './uploads/clients/'});


//Rutas
router.post('/register', client.createClient); //Crear cliente
router.post('/login', client.loginClient); //Iniciar sesión
router.put('/update-client/', md_auth.verifyToken, client.updateClient);
router.post('/upload-image-client/', [md_auth.verifyToken, md_upload], client.uploadImage);
router.get('/get-image-client/:imageFile', client.getImageFile);


module.exports = router;