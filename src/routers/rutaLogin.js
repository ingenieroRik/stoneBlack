let express = require ('express');

const usuarioLogueadoMiddleware = require('../middlewares/usuarioLogueadoMiddleware.js');

let multer = require('multer');
let router = express.Router();
let path = require('path');

const { body } = require('express-validator');// para validaciones <---- validacionRegistro, etc


//importamos el controlador de las rutas por defecto
const indexController = require ("../controllers/indexController.js");

const validacionLogin = [
    body ('email').notEmpty().withMessage('Escibe tu correo electrónico'),
    body('clave').notEmpty().withMessage('Ingresa tu clave')
];

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/images/usuarios")// se parte siempre de la raiz del proyecto a donde se guardaran los archivos
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({storage: storage});

//en vez de app.get , utilizamos router.get . Esto va guardando en router
//las distintas rutas, que luego exportamos

//procesa el pedido get con ruta /
router.get ('/', indexController.index);


// olvido contraseña
router.get ('/olvidoClave', indexController.olvidoClave);

// olvido contraseña
router.get ('/logout', indexController.logout)

//procesa el pedido get con ruta /
//router.get ('/loginUsuario', indexController.verLogin); // <----formulario loginUsuario
router.get ('/', indexController.verLogin); // <----- modal loginUsuario

//procesa el pedido post con ruta /
//router.post ('/loginUsuario',  indexController.login); // <----formulario loginUsuario
router.post ('/',  validacionLogin, indexController.login);// <----- modal loginUsuario  poner '/',validacionLogin, ....
         /*  En / hay 4 modales: /#inicio-sesion  ----> supervisor renderiza a /usuarios/listaTodosUsuarios
                                                 ----> admin renderiza a /productos/listadoProductos
                                                 ----> usuario renderiza a /
                                /#registro-usuario  
                                /#devolver
                                /#buscar
        */

//exportamos la variable router ya con todas las rutas guardadas, que se usará en app.js
module.exports = router;