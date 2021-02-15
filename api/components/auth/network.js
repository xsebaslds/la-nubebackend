const express = require('express');

const response = require('../../../network/response');
const router = express.Router();
const Controller = require('./index');

router.post('/login', function(req, res){
    Controller.login(req.body.username, req.body.password)
        .then(token => {
            response.success(req, res, token, 200);
        })
        .catch(e => {
            response.error(req, res, 'Informacion invalida', 400);
        })
})

module.exports = router;