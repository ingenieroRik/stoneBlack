let express = require ('express');
let router = express.Router();
let multer = require('multer');
let path = require('path')
const {body} = require('express-validator'); //requiero la propiedad body de express-validator
const adminMiddleware = require('../middlewares/adminMiddleware.js');

/* MULTER PARA SUBIR ARCHIVOS */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/images")
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

//importamos el controlador de las rutas por defecto 
const productsController = require ("../controllers/productsController.js");
const imageValidatorMiddleware = require('../middlewares/imageValidatorMiddleware.js');

/* VALIDACIONES */
const validacionesForm = [
    body('nombre').notEmpty().withMessage("Completa el nombre").isLength({min:5}),
    body('descripcion').notEmpty().withMessage("Completa la descripcion").isLength({min:20}),
    body('precio').notEmpty().withMessage("Completa el precio"),
    body('talle').notEmpty().withMessage("Completa el talle"),
    body('color').notEmpty().withMessage("Completa el color"),
    body('img').notEmpty().withMessage("Debes tener al menos una imagen"),
]

// ******************* mostrar un producto ************************
//procesa el pedido get con ruta /buscarProd <------ ese nombre va en el action del HTML
router.get ('/buscarProd', productsController.buscarProd);
//procesa el pedido get con ruta /productDetail <------ ese nombre va en el action del HTML
router.get ('/productDetail/:id', productsController.detalleProd);
//Envia el formulario de la compra de un producto hacia el carrito 
router.post ('/productDetail/:id', productsController.detalleProd);

// *********************** Crear un producto **************************
//Renderiza la pagina creacion producto
router.get ('/creacionProduct', adminMiddleware, productsController.creacionProd); //<-----  solo el administrador ingresa
//Procesa la creacion del producto
router.post ('/creacionProduct', upload.single("imagenProducto"), validacionesForm, productsController.procesoCreacion)


// ********************* Devolver todos los productos *********************** 
//procesa el pedido get con ruta /
router.get ('/listadoProductos', adminMiddleware, productsController.listaProduct); //<-----  solo el administrador ingresa
//procesa el pedido get con ruta /
router.get ('/listadoProductos/:id', productsController.listarProd);
//procesa el pedido get con ruta /
router.get ('/listarProdBuscado', productsController.listarProdBuscado);


// ************************** Editar un producto **************************
//Renderiza la pagina de editar producto 
router.get ('/edicionProduct/:id', productsController.edicionProd);
//Renderiza la pagina de editar producto 
router.post('/edicionProduct/:id', upload.single("imagenProducto"),validacionesForm, productsController.procesoEdicion);


// ************************** Eliminar un producto **************************
//Elimina el producto
router.delete('/delete/:id', adminMiddleware, productsController.destroy); //<-----  solo el administrador ingresa

// ************************* muestra el carrito de compras *************************
//procesa el pedido get con ruta /product-cart  <------ ese nombre va en el action del HTML
router.get ('/product-cart', productsController.detalleCarrito);



//exportamos la variable router ya con todas las rutas guardadas, que se usará en app.js
module.exports = router;