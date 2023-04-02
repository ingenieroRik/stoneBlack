
const fs = require("fs");
const bcryptjs = require('bcryptjs'); //<--- para encriptar/desencriptar la clave
// requerimos el archivo con la imagen y los datos de las remeras
//const data = require('../data/dataRemeras');
const cookieParser = require ('cookie-parser'); //<--------------IMPORTANTE

// requerimos path para poder enviar los archivos HTML
const path = require("path");
const { json } = require("express");

const { validationResult } = require('express-validator');

/* En la constante "remeras" ya tenemos los productos que están 
guardados en la carpeta data como Json (un array de objetos literales) */
//const remerasFilePath = path.join(__dirname, "../data/dataRemeras.json");
//const usuariosFilePath = path.join(__dirname, "../data/usuarios.json");
//const remeras = JSON.parse(fs.readFileSync(remerasFilePath, "utf-8"));
//const usuariosJS = JSON.parse(fs.readFileSync(usuariosFilePath, "utf-8")); //<----------------

const sequelize = require ("sequelize"); //<------------ para usar Op
const db = require('../database/models/index.js'); //<----------------para usar los modelos de la BD
const Op = sequelize.Op;

//creamos el objeto literal con los metodos a exportar
const indexController = {
  //--------------------------------------------------------------------------------------------------------------------
  index: async (req, res) => {
    var remeras =  await db.Productos.findAll();
    //return res.render ('index.ejs', {'allProducts':data} ); // data es un archivo js
    return res.render("index.ejs", { allProducts: remeras }); // remeras es un js
  },
//--------------------------------------------------------------------------------------------------------------------
  verLogin : (req, res) => {

    //console.log(req.cookie.usuarioEmail)
    //console.log (req.cookies.usuarioEmail);
    return res.render ("./usuarios/loginUsuario.ejs", );
    },

//--------------------------------------------------------------------------------------------------------------------
  login: async (req, res) => {            //<----- async y await despues para esperar los datos de la BD
    // debe ser usuario y contraseña igual a la de la de usuarios regitrados, si es admin va
    // a la pagina de listado de clientes, sino va a la pag. ppal.
    // si nos es admin puede ser usuario y si esta registrado va al carrito

    // <---------------------- para hacerlo con express-validator --------------------------------------------
    const validacionLogin = validationResult(req);
    var usuarioLogueado = req.body;
    var remerasTodas =  await db.Productos.findAll();

    if (validacionLogin.errors.length > 0 ){
  
        return res. render('index.ejs', {
          allProducts: remerasTodas,
          errors: validacionLogin.mapped(),
          oldData: req.body
      });  
    }
    
      // la idea es traer el usuario con body.email completo y hacer las comprobaciones luego
      // el usuario se guardará en usuarioDB
      console.log( req.body.email)
   
      // traemos todos los usuarios menos el supervisor, no se debe mostrar en la lista
    var usuariosTodos = await db.Usuarios.findAll( {where : { rol : {[Op.ne ] : "supervisor"}} });  // <--------- se puso el async en la funcion login
     
    

    db.Usuarios.findOne({
      where : { email : req.body.email},  //<---- busco en la tabla usuarios si existe el mail que viene del body
      raw : true,      // <-------  se agrega para que no traiga todos los metadatos que no usamos
    }).then(usuario => {
        
      console.log(usuario);

      if (usuario == null) {    // <--------- verificamos si encontro el usuario en la BD
            return res.render("index.ejs", { allProducts: remerasTodas ,
                    errors:{ email: { msg: 'El usuario '+ req.body.email + " no esta registrado."}}  }) ;
          
      }

      var usuarioBD = usuario;  //<----- acá guardo los datos del usuario que vienen de la BD
      console.log(usuarioBD);//<---------- lo imprimo para ver si esta
      //console.log(usuarioBD.rol);

// *******************  supervisor  ********************************************
  if (usuarioBD.rol == "supervisor") {

      console.log("entro a supervisor ");
      let comparacionS = bcryptjs.compareSync(usuarioLogueado.clave , usuarioBD.clave);

    if (comparacionS){  //<----------- comparo claves encriptadas 

      console.log("entro a supervisor clave ");
      req.session.usuarioLogueado = usuarioBD;
      return res.render("./usuarios/listaTodosUsuarios.ejs", { usuariosSolos: usuariosTodos});//<----- necesito los usuarios de la BD
      
    }
    return res.render("index.ejs", { allProducts: remeras ,
      errors:{ email: { msg: 'Los datos del usuario ingresados antes no son correctos'}}  }) ;
    }
   // ***************************  administrador  ******************************  
    
    if (usuarioLogueado.email == usuarioBD.email && usuarioBD.rol == "administrador") {

      console.log("entro a admin ");
      let comparacionA = bcryptjs.compareSync(usuarioLogueado.clave , usuarioBD.clave);

    if (comparacionA){  //<----------- comparo claves encriptadas 

      req.session.usuarioLogueado = usuarioBD;
      //console.log(req.session.usuarioLogueado.email);
    return res.render("./productos/listadoProductos.ejs", {allProducts: remerasTodas});
  }
  return res.render("index.ejs", { allProducts: remerasTodas ,
    errors:{ email: { msg: 'Los datos del usuario ingresados antes no son correctos'}}  }) ;

  //  *******************************  usuario  ******************************

  }  else if (usuarioLogueado.email == usuarioBD.email && usuarioBD.rol == "usuario"){
       
    console.log("entro a usuario");

        let comparacionU = bcryptjs.compareSync(usuarioLogueado.clave , usuarioBD.clave);
               
            if (comparacionU){  //<----------- comparo claves encriptadas
              
                if(req.body.recordarme) {
                    res.cookie('usuarioEmail', req.body.email, { maxAge: (1000 * 60) * 10 }); // recordamos por 10 minutos
                    console.log("recordando a "  + req.body.email);

      } req.session.usuarioLogueado=usuarioBD;
        return res.redirect ("/" );
      }else{
           return res.render("index.ejs", { allProducts: remerasTodas ,
                    errors:{ email: { msg: 'Los datos del usuario ingresados antes no son correctos'}}  }) ;
    } 
    }
      }) .catch(err => {  
      res.send(err)
      });
},
//-------------------------------------------------------------------------------------------------------------------------
   olvidoClave : (req, res) => {

    return res.render("./usuarios/formOlvidoClave.ejs");
      },
 // ---------------------------------------------------------------------------------------------------------
  logout: (req,res) => {
      //console.log("se borra sesion " );
     res.clearCookie('usuarioEmail');
     //  otra forma de borrar la cookie
     //res.cookie('usuarioEmail', null, { maxAge: -1 });
     req.session.destroy();
      return res.redirect('/');
}

}


module.exports = indexController;
