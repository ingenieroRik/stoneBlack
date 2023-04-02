// middleware para verificar formulario de devolucion de producto


const path = require('path');
const { body } = require('express-validator');

const devolverMiddleware = [
	body('nombreYapellido').notEmpty().withMessage('escribe un nombre'),	
	body('email').notEmpty().withMessage('Tienes que escribir una contraseña').bail()
		.isEmail().withMessage('Escribe un formato de correo válido'),
	body('numeroFactura').notEmpty().withMessage('Escribe un nombre de usuario'),        
	body('idProducto').notEmpty().withMessage('Escribe tu clave'),
	body('fechaDeCompra').notEmpty().withMessage('Confirma tu clave')
	
]
console.log("entro a devolverMiddleware");

module.exports = devolverMiddleware;