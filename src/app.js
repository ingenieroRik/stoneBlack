const express = require('express');
const path = require('path');
const app = express();
const methodOverride = require('method-override'); // Para poder usar los métodos PUT y DELETE
const session = require('express-session');
const usuarioLogueadoMiddleware = require('./middlewares/usuarioLogueadoMiddleware.js');
const loginVacioMiddleware = require ( './middlewares/loginVacioMiddleware.js');
const cookieParser = require ('cookie-parser');
require('dotenv').config();
const cors = require ('cors') // <--------- para que puedan ver los datos de nuestra api  hacer  --> npm i cors

//const { cookie } = require('express-validator'); // <------------- ver que es?

// para usar verbos POST y DELETE
//const methodOverride = require('method-override');
//app.use(methodOverride('_method'));

// indicamos a express usar la plantilla EJS que esta en carpeta views.
app.set('view engine', 'ejs');

//si la ruta por defecto no es /views debemos decirle a node que la carpeta se encuentra
// en otra ruta, para ello usamos:
app.set('views', './src/views');

// o tambien asi :
//app.set('views', path.join(__dirname,'../src/views'));

app.use(cors());

// usando los recursos estaticos css,images,etc
app.use(cookieParser());
app.use(session({
    secret: 'Nuestro mensaje secreto',
    resave: false,
    saveUninitialized:false,}));
app.use(usuarioLogueadoMiddleware); // <----- tiene que ir despues de usar session
//app.use(loginVacioMiddleware)


app.use(express.static('public'));
app.use(methodOverride('_method')); // Para poder usar los métodos PUT y DELETE
app.use(express.urlencoded({extended:false})); // MUY IMPORTANTE!!!  para usar el metodo POST
app.use(express.json()); // MUY IMPORTANTE!!!  para usar el metodo POST

//importamos los distintos enrutadores
let rutaLogin = require ('./routers/rutaLogin.js');
let rutaUsuarios = require('./routers/rutaUsuarios.js');
let rutaProductos = require ('./routers/rutaProductos.js');

//Aquí llamo a la ruta de las api de usarios para consumir en el dashboard con react
const apiUsuariosRouter = require('./routers/api/usuarios.js')
const apiProductosRouter = require('./routers/api/productos.js')

//Aqui llamo a la ruta para la api de consumo del carrito
const apiController = require('./routers/api.js')

// usando los enrutadores importados
app.use(rutaLogin);
app.use(rutaUsuarios);
app.use(rutaProductos);

//Aquí creo los recursos de mis APIs para consumir en el dashboard con react
app.use('/api/usuarios', apiUsuariosRouter);
app.use("/api/productos", apiProductosRouter);

//Aquí creo los recursos de mi API local
app.use('/api/product', apiController);

/*************************probamos conexion  con la base de datos REMOTA *********************/
var mysql = require('mysql'); //<----- npm install mysql 

var conexion = mysql.createConnection({
    host:'db4free.net',
    database:'stoneblack_db',
    user:'dh_grupo3',
    password:'12345678'});
  
    conexion.connect (function (error){
        if (error){
            throw error;
        } else { console.log("Conecto con éxito la base de Datos")}
    });
    conexion.end();
/*****************************************************************************/

/*************************probamos conexion  con la base de datos local *********************/
/* var mysql2 = require('mysql2'); //<----- npm install mysql2 

var conexion = mysql2.createConnection({
    host:'127.0.0.1',
    database:'stoneblack_db',
    user:'root',
    password:'master4'});
  
    conexion.connect (function (error){
        if (error){
            throw error;
        } else { console.log("Conecto con éxito la base de Datos")}
    });
    conexion.end(); */
/***************************************************************************** */





// ponemos a escuchar el servidor
app.listen(process.env.PORT || 3041, () =>  // si subimos a un hosting este nos dará el puerto, sinó sera 3041
console.log('Servidor corriendo en http://localhost:3041')
);

// subido a RENDER  como  https://stoneblack.onrender.com