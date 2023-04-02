let express = require ('express');
let multer = require('multer');
let router = express.Router();
let path = require('path');

const { body } = require('express-validator');// para validaciones <---- validacionRegistro

//importamos el controlador de las rutas por defecto
const userController = require ("../controllers/userController.js");
const adminMiddleware = require('../middlewares/adminMiddleware.js');
const supervisorMiddleware = require('../middlewares/supervisorMiddleware');
const devolverMiddleware = require('../middlewares/devolverMiddleware.js');
const imageValidatorMiddleware = require('../middlewares/imageValidatorMiddleware.js');
//const validacionRegistro = require('../middlewares/validateRegisterMiddleware.js');


const validacionesDev = [
	body('nombreYapellido').notEmpty().withMessage('escribe un nombre'),	
	body('email').notEmpty().withMessage('Tienes que escribir tu correo').bail()
			.isEmail().withMessage('Escribe un formato de correo válido'),
    body('numeroDeFactura').notEmpty().withMessage('Escribe el número de la factura'),        
	body('idProducto').notEmpty().withMessage('Escribe el código de producto'),
	body('fechaDeCompra').notEmpty().withMessage('Escribe la fecha de compra')
	
]

const validaciones = [
	body('nombreYapellido').notEmpty().withMessage('escribe un nombre'),
	body('nombreUsuario').notEmpty().withMessage('Escribe un nombre de usuario'),
	body('email').notEmpty().withMessage('Tienes que escribir una contraseña').bail()
			.isEmail().withMessage('Escribe un formato de correo válido'),
	body('clave').notEmpty().withMessage('Escribe tu clave'),
	body('confirmarClave').notEmpty().withMessage('Confirma tu clave')
	
]

//********************** usamos multer para archivos,imagenes,etc ********************

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/images/usuarios")// se parte siempre de la raiz del proyecto a donde se guardaran los archivos
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({storage: storage})

//en vez de app.get , utilizamos router.get . Esto va guardando en router
//las distintas rutas, que luego exportamos

 // Verificar la extensión del archivo
 
// Ruta que utiliza el middleware de validación de imagen
//Router.post('/upload', upload.single('image'), validacionImagen, (req, res, next) => {
 // Enviar respuesta exitosa si todo es correcto
// res.status(200).json({ message: 'Archivo subido exitosamente' });
//});




// ****************** mostrar un usuario ***********************


// ************** listar todos los usuarios ********************
//procesa el pedido get con ruta /listaUsuarios  <------ ese nombre va en el action del HTML
router.get ('/listaUsuarios', userController.listarUsuarios);


// *************** crear un usuario *************
//procesa el pedido post con ruta /listaUsuarios    <------ ese nombre va en el action del HTML
router.get ('/registroUsuario/',userController.verFormulario);
//procesa el pedido post con ruta /listaUsuarios    <------ ese nombre va en el action del HTML
router.post ('/modalUsuario', upload.single("imagenUsuario"), imageValidatorMiddleware, validaciones,  userController.crearUsuario);// <----- validaciones

//procesa el pedido post con ruta /formUsuario ------> ese nombre va en el action del HTML
router.put ('/listaUsuarios/:id', userController.editarUsuario);


// ******************* crear administrador *********************
router.post ('/listaTodosUsuarios',supervisorMiddleware ,upload.single("imagenUsuario"), validaciones, userController.crearAdmin);//<---- validaciones-----  solo el supervisor ingresa
//procesa el pedido post con ruta /listaTodosUsuarios    <------ ese nombre va en el action del HTML
router.get ('/listaTodosUsuarios', supervisorMiddleware ,userController.listarTodos);//<----------- solo supervisor ingresa


// ************ editar un usuario ***********************
//procesa el pedido get con ruta /formUsuario ------> ese nombre va en el action del HTML
router.get ('/formUsuario/:id', userController.editarUsuario);
//procesa el pedido post con ruta /formUsuario ------> ese nombre va en el action del HTML
router.put ('/formUsuario/:id', upload.single("imagenUsuarioEditada"), userController.procesoEdicionUsuario);


// *************** eliminar un usuario *********************
//procesa el pedido delete con ruta /listaUsuarios  <------ ese nombre va en el action del HTML
router.delete ('/listaUsuarios/:id', userController.eliminarUsuario);


// *************** eliminar un administrador o usuario *********************
//procesa el pedido delete con ruta /listaTodosUsuarios  <------ ese nombre va en el action del HTML
router.delete ('/listaTodosUsuarios/:id', supervisorMiddleware , userController.eliminarCualquiera);//<-----  solo el supervisor ingresa


// ************** procesar devolucion********************
//procesa el pedido get con ruta /crearDevolucion  <------ ese nombre va en el action del HTML
router.get ('/crearDevolucion', userController.crearDevolucion);

//procesa el pedido post con ruta /crearDevolucion    <------ ese nombre va en el action del HTML
router.post ('/crearDevolucion',validacionesDev , userController.crearDevolucion);//<----- validamos los datos del formulario de devolucion
                                                                                    // con devolverMiddleware


// ************** Listar devolucion********************

//procesa el pedido get con ruta /listaDevolucion  <------ ese nombre va en el action del HTML
router.get ('/listaDevolucion', adminMiddleware, userController.listaDevolucion);//<-----  solo el administrador ingresa

//procesa el pedido post con ruta /listaDevolucion    <------ ese nombre va en el action del HTML
router.post ('/listaDevolucion',  userController.listaDevolucion);


// ************** Recuperar contraseña********************
//procesa el pedido get con ruta /claveIncorrecta     <------ ese nombre va en el action del HTML
router.get ('/claveIncorrecta', userController.claveIncorrecta);

//exportamos la variable router ya con todas las rutas guardadas, que se usará en app.js
module.exports = router;