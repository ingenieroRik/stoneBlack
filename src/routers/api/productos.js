// estas rutas son para el controlador de la api  con el dasboard con REACT

const express = require('express');
const router = express.Router();
const productosAPIController = require('../../controllers/api/productosAPIController');

//Rutas
//Listado de todos los productos
router.get('/', productosAPIController.list);

//Detalle por usuario
router.get('/:id', productosAPIController.detail);


module.exports = router;