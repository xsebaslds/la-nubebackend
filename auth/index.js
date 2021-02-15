const jwt = require('jsonwebtoken');
const config = require('../config');
const error = require('../utils/error');
const secret = config.jwt.secret;

function sign(data){
    return jwt.sign(data, secret);
}

const check = {
    own: function(req, owner){
        const decoded = decodeHeader(req);
        console.log(decoded);

        if(decoded.id !== owner){
            throw error('No puedes hacer esto', 401);
        }
    },
}

function decodeHeader(req){
    const authorization = req.headers.authorization || '';
    const token = getToken(authorization);
    const decoded = verify(token);

    req.user = decoded;
    return decoded;
}

function getToken(auth){
    if(!auth){
        throw new Error('No viene token');
    }
    if(auth.indexOf('Bearer ') === -1){
        throw new Error('Formato invalido')
    }

    let token = auth.replace('Bearer ', '');
    return token;
}

function verify(token){
    return jwt.verify(token, secret)
}

module.exports = {
    sign,
    check,
};