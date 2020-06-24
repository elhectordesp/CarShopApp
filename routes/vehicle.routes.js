const express = require('express');
const router = express.Router();
const vehicle = require('../controllers/vehicle.controller');
const md_auth = require('../middlewares/authentication');
const multipart = require('connect-multiparty');
const md_upload = multipart({uploadDir: './uploads/vehicles/'});

router.get('/artist/', vehicle.getVehicle);
router.post('/', /*md_auth.verifyToken,*/ vehicle.createVehicle);
router.put('/update-vehicle/', /*md_auth.verifyToken,*/ vehicle.updateVehicle);
router.post('/upload-image-vehicle/', [/*md_auth.verifyToken,*/ md_upload], vehicle.uploadImage);
router.get('/get-image-vehicle/:imageFile', vehicle.getImageFile);
router.get('/vehicles/', vehicle.getVehicles);
router.delete('/', /*md_auth.verifyToken,*/ vehicle.deleteVehicle);

module.exports = router;