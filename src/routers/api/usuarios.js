// estas rutas son para el controlador de la api  con el dasboard con REACT

const express = require('express');
const router = express.Router();
const usuariosAPIController = require('../../controllers/api/usuariosAPIController');

//Rutas
//Listado de todos los usuarios
router.get('/', usuariosAPIController.list);
//Detalle por usuario
router.get('/:id', usuariosAPIController.detail);


module.exports = router;