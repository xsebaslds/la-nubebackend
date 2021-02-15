const express = require('express');

const secure = require('./secure');
const response = require('../../../network/response');
const Controller = require('./index');

const router = express.Router();

// Routes
router.get('/', list);
router.get('/:id', get);
router.post('/', insert);
router.put('/', secure('update'), upsert);
router.delete('/:id', remove);

function list(req, res, next){
    Controller.list()
    .then((lista) => {
        response.success(req, res, lista, 200); 
    })
    .catch(next);
}

function get(req, res, next){
    Controller.get(req.params.id)
        .then((user) => {
            response.success(req, res, user, 200);
        })
        .catch(next);
}

function insert(req, res, next){
    Controller.insert(req.body)
        .then((user) => {
            response.success(req, res, req.body, 200);
        })
        .catch(next);
}

function upsert(req, res, next){
    Controller.upsert(req.body)
        .then((user) => {
            response.success(req, res, req.body, 200);
        })
        .catch(next);
}

function remove(req, res, next){
    Controller.remove(req.params.id)
    .then((user) => {
        response.success(req, res, 'Usuario eliminado', 200);
    })
    .catch(next);
}

module.exports = router;