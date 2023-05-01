// estas rutas son para el controlador de la api  con el dasboard con REACT

const express = require('express');
const router = express.Router();
const ventasAPIController = require('../../controllers/api/ventasAPIController');

//Rutas
//Listado de todos los usuarios
router.get('/', ventasAPIController.list);
//Detalle por usuario
//router.get('/:id', ventasAPIController.detail);


module.exports = router;