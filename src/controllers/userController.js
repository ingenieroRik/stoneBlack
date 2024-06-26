const fs = require("fs");

const nodemailer = require('nodemailer');

const bcryptjs = require("bcryptjs"); //<--- para encriptar/desencriptar la clave
const { validationResult } = require("express-validator");

// requerimos el archivo con la imagen y los datos de las remeras
//const data = require('../data/dataRemeras');

// requerimos path para poder enviar los archivos HTML
const path = require("path");
const { json } = require("express");

/* En la constante "remeras" ya tenemos los productos que están 
guardados en la carpeta data como Json (un array de objetos literales) */
//const remerasFilePath = path.join(__dirname, "../data/dataRemeras.json");
//const usuariosFilePath = path.join(__dirname, "../data/usuarios.json");
//const remeras = JSON.parse(fs.readFileSync(remerasFilePath, "utf-8"));
//const usuariosJS = JSON.parse(fs.readFileSync(usuariosFilePath, "utf-8"));

//const devolucionesFilePath = path.join(__dirname, "../data/devoluciones.json");

//const devoluciones = JSON.parse(fs.readFileSync(devolucionesFilePath, "utf-8"));

const sequelize = require("sequelize"); //<------------ para usar Op
const db = require("../database/models/index.js");

const Op = sequelize.Op;

const userController = {
  verFormulario: (req, res) => {
    return res.render("./usuarios/registroUsuario.ejs");
  },

  // ************************************************************************************************************************
  crearUsuario: async function (req, res) {
    var remerasTodas = await db.Productos.findAll();
    var usuariosBD = await db.Usuarios.findAll();

    const resultadosValidacion = validationResult(req);

    if (resultadosValidacion.errors.length > 0) {
      return res.render("index.ejs", {
        allProducts: remerasTodas,
        errors: resultadosValidacion.mapped(),
        oldData: req.body,
      });
    }
    //primero chequeamos que el usuario no exista, lo que no se debe repetir es el email
    for (let i = 0; i < usuariosBD.length; i++) {
      if (
        usuariosBD[i].email == req.body.email &&
        usuariosBD[i].rol == "usuario"
      ) {
        return res.render("index.ejs", {
          allProducts: remerasTodas,
          errors: {
            pieForm: {
              msg: "el usuario " + req.body.nombreYapellido + " ya existe",
            },
          },
          oldData: req.body,
        });
      }
    }
    if (req.body.clave == req.body.confirmarClave) {
      //<----- se crea el usuario

      db.Usuarios.create({
        nombre_y_apellido: req.body.nombreYapellido,
        nombre_usuario: req.body.nombreUsuario,
        uri_avatar: req.file ? req.file.filename : " ", //<------------- preguntamos si hay imagen(que viene en el req.file) sino dejamos vacío
        email: req.body.email,
        clave: bcryptjs.hashSync(req.body.clave, 10), // <------------ se encripta la clave
        rol: "usuario",
      })
        .then(() => {
          console.log("usuario creado");
          return res.render("index.ejs", {
            allProducts: remerasTodas,
            errors: {
              pieForm: {
                msg:
                  "el usuario " +
                  req.body.nombreYapellido +
                  "  se creo correctamente",
              },
            },
            oldData: req.body,
          });
        })
        .catch((err) => {
          res.send("el email ya existe");
        });
    } else {
      return res.render("index.ejs", {
        allProducts: remerasTodas,
        errors: { confirmarClave: { msg: "la clave no coincide" } },
        oldData: req.body,
      });
    }
  },

  // ***************************************************************************************************************************
  crearAdmin: async (req, res) => {
    var usuariosBD = await db.Usuarios.findAll();

    const resultadosValidacion = validationResult(req);

    if (resultadosValidacion.errors.length > 0) {
      console.log("entro crear admin");
      return res.render("./usuarios/listaTodosUsuarios", {
        usuariosSolos: usuariosBD,
        errors: resultadosValidacion.mapped(),
        oldData: req.body,
      });
    }

    //primero chequeamos que el usuario no exista, lo que no se debe repetir es el email
    for (let i = 0; i < usuariosBD.length; i++) {
      if (
        usuariosBD[i].email == req.body.email &&
        usuariosBD[i].rol == "administrador"
      ) {
        return res.render("./usuarios/listaTodosUsuarios.ejs", {
          usuariosSolos: usuariosBD,
          errors: {
            pieForm: {
              msg:
                "el administrador " + req.body.nombreYapellido + " ya existe",
            },
          },
          oldData: req.body,
        });
      }
    }
    if (req.body.clave == req.body.confirmarClave) {
      // si clave y confirmar clave coinciden creamos el nuevo administrador

      // creo el administrador
      db.Usuarios.create({
        nombre_y_apellido: req.body.nombreYapellido,
        nombre_usuario: req.body.nombreUsuario,
        uri_avatar: req.file ? req.file.filename : " ",
        email: req.body.email,
        clave: bcryptjs.hashSync(req.body.clave, 10), // <------------ se encripta la clave
        rol: "administrador",
      })
        .then(() => {
          return res.render("./usuarios/listaTodosUsuarios.ejs", {
            usuariosSolos: usuariosBD,
            errors: {
              pieForm: {
                msg:
                  "el administrador " +
                  req.body.nombreYapellido +
                  " se creo correctamente",
              },
            },
            oldData: req.body,
          });
        })
        .catch((err) => {
          res.send(err);
        });
    } else {
      return res.render("./usuarios/listaTodosUsuarios.ejs", {
        usuariosSolos: usuariosBD,
        errors: { confirmarClave: { msg: "la clave no coincide" } },
      });
    }
  },

  // ****************************************************************************************************************
  listarUsuarios: (req, res) => {
    db.Usuarios.findAll({ 
              where: { rol: "usuario" }, //<---- busco en la tabla usuarios si existe el mail que viene del body
              raw: true,                 // <-------  se agrega para que no traiga todos los metadatos que no usamos

              order : [['nombre_y_apellido' ,'ASC']]   // ordenado alfabeticamente
    })

      .then((usuarios) => {
        return res.render("./usuarios/listaUsuarios.ejs", {
          usuariosSolos: usuarios,
        });
      })
      .catch((err) => {
        res.send(err);
      });
  },

  // ****************************************************************************************************************
  listarTodos: (req, res) => {
    db.Usuarios.findAll({
      where: { rol: { [Op.ne]: "supervisor" } }, //el supervisor no debe aparecer en la lista
      raw: true,                                 // <-------  se agrega para que no traiga todos los metadatos que no usamos
      order : [['nombre_y_apellido' ,'ASC']]    // ordenado alfabeticamente
    })
      .then((usuariosTodos) => {
        return res.render("./usuarios/listaTodosUsuarios.ejs", {
          usuariosSolos: usuariosTodos,
        });
      })
      .catch((err) => {
        res.send(err);
      });
  },

  // ***********************************************************************************************************
  editarUsuarioAdmin: (req, res) => {
    try {

    db.Usuarios.findByPk(req.params.id).then((usuarioFiltrado) => {
      res.render("./usuarios/formUsuario.ejs", { usuario: usuarioFiltrado });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  },

  // ************************************************************************************************************************
  procesoEdicionUsuarioAdmin: async (req, res) => {
    //console.log(req.body);

    //traemos todos los usuarios menos el editado, para que no nos diga que el usuario existe
    var usuariosBD = await db.Usuarios.findAll({
      where: { id: { [Op.ne]: req.params.id } },
    });

    const resultadosValidacion = validationResult(req);

    if (resultadosValidacion.errors.length > 0) {
      return res.render("./usuarios/formUsuario.ejs", {
        usuario: req.params.id,
        errors: resultadosValidacion.mapped(),
        oldData: req.body,
      });
    } else {
      //primero chequeamos que el usuario no exista, lo que no se debe repetir es el email
      for (let i = 0; i < usuariosBD.length; i++) {
        console.log("entro al for");
        console.log(usuariosBD[i].email + req.body.email);

        if (usuariosBD[i].email == req.body.email) {
          console.log(usuariosBD[i].email);

          return res.render("./usuarios/formUsuario.ejs", {
            usuario: req.params.id,
            errors: {
              pieForm: {
                msg: "el usuario con " + req.body.email + " ya existe",
              },
            },
            oldData: req.body,
          });
        }
      }
    }

    console.log(req.body.clave);
    console.log(req.body.confirmarClave);

    if (req.body.clave == req.body.confirmarClave) {
      //<----- se crea el usuario

      console.log("claves iguales");

      db.Usuarios.update(
        {
          nombre_y_apellido: req.body.nombreYapellido,
          nombre_usuario: req.body.nombreUsuario,
          uri_avatar: req.file ? req.file.filename : " ",
          email: req.body.email,
          clave: bcryptjs.hashSync(req.body.clave, 10), // <------------ se encripta la clave
          rol: "usuario",
        },
        {
          where: { id: req.params.id }, //<--------- el id viene en la url
        }
      )
        .then(function () {
          res.redirect("/listaUsuarios");
        })
        .catch((err) => {
          res.send(err);
        });
    } else {
      console.log("claves distintas");

      return res.render("./usuarios/formUsuario.ejs", {
        usuario: req.params.id,
        errors: { confirmarClave: { msg: "la clave no coincide" } },
        oldData: req.body,
      });
    }
  },

  /*
procesoEdicionUsuario: (req, res) => {
         console.log(req.body);

      db.Usuarios.update({
            nombre_y_apellido: req.body.nombreYapellido,
            nombre_usuario: req.body.nombreUsuario,
            uri_avatar: req.body.uri_avatar,
            email: req.body.email,
            clave: bcryptjs.hashSync (req.body.clave, 10),  // <------------ se encripta la clave
            rol: "usuario"
            },
            {where : { id : req.params.id } //<--------- el id viene en la url 

      }).then(function(usuario){

        console.log(usuario);

        res.redirect("/listaUsuarios"); 

      }).catch(err => {
        res.send(err)
     })    
    },
*/
    // ***********************************************************************************************************
editarUsuarioUser: (req, res) => {
  try {
  db.Usuarios.findByPk(req.params.id).then((usuarioFiltrado) => {
    res.render("./usuarios/formEditarUsuario.ejs", { usuario: usuarioFiltrado });
  });
} catch (error) {
  return res.status(500).json({ message: error.message });
}
},

// ************************************************************************************************************
procesoEdicionUsuarioUser: async (req, res) => {
  //console.log(req.body);

  //traemos todos los usuarios menos el editado, para que no nos diga que el usuario existe
  var usuariosBD = await db.Usuarios.findAll({
    where: { id: { [Op.ne]: req.params.id } },
  });

  const resultadosValidacion = validationResult(req);

  if (resultadosValidacion.errors.length > 0) {
    return res.render("./usuarios/formEditarUsuario.ejs", {
      usuario: req.params.id,
      errors: resultadosValidacion.mapped(),
      oldData: req.body,
    });
  } else {
    //primero chequeamos que el usuario no exista, lo que no se debe repetir es el email
    for (let i = 0; i < usuariosBD.length; i++) {
     // console.log("entro al for");
      //console.log(usuariosBD[i].email + req.body.email);

      if (usuariosBD[i].email == req.body.email) {
        console.log(usuariosBD[i].email);

        return res.render("./usuarios/formEditarUsuario.ejs", {
          usuario: req.params.id,
          errors: {
            pieForm: {
              msg: "el usuario con " + req.body.email + " ya existe",
            },
          },
          oldData: req.body,
        });
      }
    }
  }

  console.log(req.body.clave);
  console.log(req.body.confirmarClave);

  if (req.body.clave == req.body.confirmarClave) {
    //<----- se crea el usuario

    console.log("claves iguales");

    db.Usuarios.update(
      {
        nombre_y_apellido: req.body.nombreYapellido,
        nombre_usuario: req.body.nombreUsuario,
        uri_avatar: req.file ? req.file.filename : " ",
        email: req.body.email,
        clave: bcryptjs.hashSync(req.body.clave, 10), // <------------ se encripta la clave
        rol: "usuario",
      },
      {
        where: { id: req.params.id }, //<--------- el id viene en la url
      }
    )
      .then(function () {
        res.redirect("/");
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    console.log("claves distintas");

    return res.render("./usuarios/formEditarUsuario.ejs", {
      usuario: req.params.id,
      errors: { confirmarClave: { msg: "la clave no coincide" } },
      oldData: req.body,
    });
  }
},

  // ***********************************************************************************************************************
  eliminarUsuario: function (req, res) {
    let usuarioId = req.params.id;
    db.Usuarios.destroy({ where: { id: usuarioId }, force: true }) // force: true es para asegurar que se ejecute la acción
      .then(() => {
        return res.redirect("/listaUsuarios");
      })
      .catch((error) => res.send("No se puede eliminar este usuario, tiene facturas asociadas"));
  },

  // *********************************************************************************************************************
  eliminarCualquiera: (req, res) => {
    let usuarioId = req.params.id;
    db.Usuarios.destroy({ where: { id: usuarioId }, force: true }) // force: true es para asegurar que se ejecute la acción
      .then(() => {
        return res.redirect("/listaTodosUsuarios");
      })
      .catch((error) => res.send("No se puede eliminar este usuario, tiene facturas asociadas"));
  },
  // ****************************************************************************************************
  perfilUsuario: async function (req, res) {
    try {
    let ventas = await db.Ventas.findAll( {attributes :["numero_factura" ,  "fecha" , "total", "id_usuario"],// * si no restrinjo atributos marca error de campo id 
    raw: true,
      where: { id_usuario: req.params.id },
    });
    // return res.send(orders);
    return res.render("./usuarios/perfilUsuario", { ventas });


  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  },


  // **********************************************************************************************************************
  crearDevolucion: async (req, res) => {
    const resultadosValidacion = validationResult(req);
    var remerasTodas = await db.Productos.findAll();

    if (resultadosValidacion.errors.length > 0) {
      return res.render("index.ejs", {
        allProducts: remerasTodas,
        errors: resultadosValidacion.mapped(),
        oldData: req.body,
      });
    }

    const usuarioDevuelve = await db.Usuarios.findOne({
      where: { email: req.body.email },
      raw: true,
    });

    if (usuarioDevuelve == null) {
      // <--------- si existe el email creamos la devolucion
      return res.render("index.ejs", {
        allProducts: remerasTodas,
        errors: { pieForm: { msg: "el usuario con este email no existe" } },
        oldData: req.body,
      });
    }
    // hay que verificar todos los datos que faltan de la devolución
    // verificamos número de factura y fecha
         
         try {
          const numFactyFecha = await db.Ventas.findOne({attributes :["numero_factura" ,  "fecha" , "total", "id_usuario"],// si no restrinjo atributos marca error de campo id 
            

          // no verificamos fecha porque desde el formulario html viene en el formato dd/mm/yyyy y la bbdd lo acepta en yyyy/mm/dd
          /*
          where: {[Op.and]: [
            { numero_factura: req.body.numeroDeFactura},
            { fecha: req.body.fechaDeCompra}
            ],         
          },
            raw: true,
          });
          */
          
          where : {numero_factura : req.body.numeroDeFactura},
            raw: true,
          });
         

          console.log(numFactyFecha);
        
          if (numFactyFecha == null) {

            return res.render("index.ejs", {
              allProducts: remerasTodas,
              errors: { pieForm: { msg: "Los datos de factura y/o fecha no son correctos" } },
              oldData: req.body,
            });
          }
          
        }
        catch (error) {
          return res.status(500).json({ message: error.message });

        }
        // verificamos id de producto
        try {
          const numProd = await db.Productos_por_venta.findOne({
            where: { id_venta: req.body.numeroDeFactura},
            raw: true,
          });
         
          
          if (numProd.id_producto != req.body.idProducto) {

            return res.render("index.ejs", {
              allProducts: remerasTodas,
              errors: { pieForm: { msg: "Los datos del producto no son correctos" } },
              oldData: req.body,
            });
          }
          
        }
        catch (error) {
          return res.status(500).json({ message: error.message });

        }

    // hacemos una consulta para ver si esta devolución ya fue registrada antes
    var devolucion = await db.Devoluciones.findAll({
      where: {
        [Op.and]: [
          { email: req.body.email },
          { id_producto: req.body.idProducto },
          { numero_factura: req.body.numeroDeFactura },
        ],
      },
      raw: true,
    });


    if (devolucion.length != 0) {
      return res.render("index.ejs", {
        allProducts: remerasTodas,
        errors: { pieForm: { msg: "Esta devolucion fue registrada ántes" } },
        oldData: req.body,
      });
    } else {
      db.Devoluciones.create({
        nombre_y_apellido: req.body.nombreYapellido,
        email: req.body.email,
        numero_factura: req.body.numeroDeFactura,
        id_producto: req.body.idProducto,
        fecha: req.body.fechaDeCompra,
      })
        .then(() => {
          return res.render("index.ejs", {
            allProducts: remerasTodas,
            errors: { pieForm: { msg: "La devolucion se registró" } },
            oldData: req.body,
          });
        })
        .catch((error) => res.send(error));
    }
  },

  // *****************************************************************************************************************
  listaDevolucion: (req, res) => {
    db.Devoluciones.findAll({
      raw: true,
    })
      .then((devoluciones) => {
        return res.render("./usuarios/listaUsuariosDevolucion.ejs", {
          devolucionesSolas: devoluciones,
        });
      })
      .catch((err) => {
        res.send(err);
      });
  },

  // **********************************************************************************************************
  olvidoClave : (req, res) => {

    return res.render("./usuarios/formOlvidoClave.ejs");
      },
 
  // ***********************************************************************************************************
  enviarMail : async (req, res) => {
    const email = req.body.email;
    const clave = 1111;
    //const mensaje1 = "Hola";

    console.log("entro a enviar mail a :" + email)
    // verificamos si el usuario existe

    const usuarioDevuelve = await db.Usuarios.findOne({
      where: { email: email },
      raw: true,
    });

    if (usuarioDevuelve == null) {
      // <--------- si existe el email creamos la devolucion
      console.log("el usuario no existe")

      return res.render("./usuarios/formOlvidoClave.ejs"
      , {
        errors:{ pieError: { msg: 'El usuario: '+ email + "  , no esta registrado."}} 
        }
      );
    }

    //const clave = usuarioDevuelve.clave;

    let transporter = nodemailer.createTransport({
        host: process.env.MAILSERVER,
        port: 465,
        secure: true,
        auth: {
          user: process.env.USER ,//<-------------  mail desde donde se envia
          pass: process.env.PASS  // <-----------  clave proporcionada por gmail
        },
        tls: {
            rejectUnauthorized: false
        }
    });


    const mensaje = {
      from: '"stoneblack" <info@stoneblack.com>', // <----------- quien lo manda
      to: email ,//<-------------- aca viene el email del usuario desde el ejs
      subject: "Formulario de contacto de StoneBlack",
       text: "Saludos de stoneblack.onrender.com su clave es : " + clave + " , cambiela por seguridad",
      //html: "<b>Hola </b>",
    }

    try {
      let info = await transporter.sendMail(mensaje);

      console.log("mensaje enviado");

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

      //res.send("el mail se envió correctamente");
      const clave1111 ="1111";

        await db.Usuarios.update(
          {
            clave: bcryptjs.hashSync(clave1111, 10), // <------------ se encripta la clave
          },
          {
            where: {  email : email}, 
          }
        )

        return res.render("./usuarios/formOlvidoClave.ejs", {
          
          errors: { pieForm: { msg: "El mail se envió correctamente" } },
        })


        } catch {

          return res.render("./usuarios/formOlvidoClave.ejs", {
          
            errors: { pieError: { msg: "El mail no se pudo enviar" } },
          })

    }
    
   

},
/* **************************************************************************************** */

  losTresChiflados: (req, res) => {
    return res.render("./usuarios/losTresChiflados.ejs");
  },

};
module.exports = userController;
