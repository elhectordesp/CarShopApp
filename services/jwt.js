const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'secreto_el_famoso_biberon';

exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        photo: user.photo,
        iat: moment().unix(),
        exp: moment().add(365, 'days').unix()
    };

    return jwt.encode(payload, secret);
};

exports.createTokenCli = function(client) {
    var payload = {
        sub: client._id,
        name: client.name,
        email: client.email,
        city: client.city,
        logo: client.logo,
        iat: moment().unix(),
        exp: moment().add(365, 'days').unix()
    };

    return jwt.encode(payload, secret);
};