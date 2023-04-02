const fs = require("fs");
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

const devolucionesFilePath = path.join(__dirname, "../data/devoluciones.json");

const devoluciones = JSON.parse(fs.readFileSync(devolucionesFilePath, "utf-8"));

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
        uri_avatar: req.file ? req.file.filename : " ",
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
      raw: true, // <-------  se agrega para que no traiga todos los metadatos que no usamos
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
      raw: true, // <-------  se agrega para que no traiga todos los metadatos que no usamos
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
  editarUsuario: (req, res) => {
    db.Usuarios.findByPk(req.params.id).then((usuarioFiltrado) => {
      res.render("./usuarios/formUsuario.ejs", { usuario: usuarioFiltrado });
    });
  },

  // ************************************************************************************************************************
  procesoEdicionUsuario: async (req, res) => {
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
          uri_avatar: req.body.uri_avatar,
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
  // ***********************************************************************************************************************
  eliminarUsuario: function (req, res) {
    let usuarioId = req.params.id;
    db.Usuarios.destroy({ where: { id: usuarioId }, force: true }) // force: true es para asegurar que se ejecute la acción
      .then(() => {
        return res.redirect("/listaUsuarios");
      })
      .catch((error) => res.send(error));
  },

  // *********************************************************************************************************************
  eliminarCualquiera: (req, res) => {
    let usuarioId = req.params.id;
    db.Usuarios.destroy({ where: { id: usuarioId }, force: true }) // force: true es para asegurar que se ejecute la acción
      .then(() => {
        return res.redirect("/listaTodosUsuarios");
      })
      .catch((error) => res.send(error));
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

  // ********************************************************************************************************
  formClaveIncorrecta: (req, res) => {
    console.log(req.body.email);
    return res.render("./usuarios/formClaveIncorrecta.ejs");
  },

  // *******************************************************************************************************
  claveIncorrecta: (req, res) => {
    const usuariosJS = JSON.parse(fs.readFileSync(usuariosFilePath, "utf-8"));
    for (let i = 0; i < usuariosJS.length; i++) {
      console.log(req.body.email);
      if (req.body.email == usuariosJS[i].email) {
        //return res.render("./usuarios/formClaveIncorrecta.ejs")
        return res.render("./usuarios/formClaveIncorrecta");
      }
    }
  },
};
module.exports = userController;
