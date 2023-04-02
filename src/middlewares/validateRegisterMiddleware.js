const path = require('path');
const { body } = require('express-validator');

	const validateRegisterMiddleware = [
	body('nombreYapellido').notEmpty().withMessage('escribe un nombre').isLength({min:2}),
	body('nombreUsuario').notEmpty().withMessage('Escribe un nombre de usuario'),
	body('email').notEmpty().withMessage('Tienes que escribir una contraseña').bail()
			.isEmail().withMessage('Escribe un formato de correo válido'),
	body('clave').notEmpty().withMessage('Escribe tu clave').isLength({min:8}),
	body('confirmarClave').notEmpty().withMessage('Confirma tu clave').isLength({min:8})
	
]
module.exports = validateRegisterMiddleware;