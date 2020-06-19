const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'secreto_el_famoso_biberon';

const tokenCtrl = {};

tokenCtrl.verifyToken = async (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).send({
            message: 'La petición no tiene la cabecera de Autenticación.'
        });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'Token ha expirado.'
            });
        }
    }catch(ex) {
        console.log(ex);
        return res.status(404).send({
            message: 'Token no válido.'
        });
    }

    req.user = payload;

    next();
}


module.exports = tokenCtrl;
