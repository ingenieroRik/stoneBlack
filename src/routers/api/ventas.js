// estas rutas son para el controlador de la api  con el dasboard con REACT

const express = require('express');
const router = express.Router();
const ventasAPIController = require('../../controllers/api/ventasAPIController');
const userMiddleware = require('../../middlewares/userMiddleware.js');

//Rutas
//Listado de todos los usuarios
router.get('/', ventasAPIController.list);
//Detalle por usuario
//router.get('/:id', ventasAPIController.detail);
router.post ("/checkout", userMiddleware, ventasAPIController.checkout);  //<-----------  para la compra del carrito//
router.get ("/checkout", userMiddleware, ventasAPIController.checkout);


module.exports = router;