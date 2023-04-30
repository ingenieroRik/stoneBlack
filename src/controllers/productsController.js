const fs = require("fs");

// requerimos el archivo con la imagen y los datos de las remeras
//const data = require('../data/dataRemeras');

// requerimos path para poder enviar los archivos HTML
const path = require("path");
const { json } = require("express");

/* Requerimos propiedad validationResult para poder validar campos de form */
const {validationResult, body} = require('express-validator');

/* En la constante "remeras" ya tenemos los productos que están 
guardados en la carpeta data como Json (un array de objetos literales) */
//const remerasFilePath = path.join(__dirname, "../data/dataRemeras.json");
//const usuariosFilePath = path.join(__dirname, "../data/usuarios.json");
//const remeras = JSON.parse(fs.readFileSync(remerasFilePath, "utf-8"));
//const usuariosJS = JSON.parse(fs.readFileSync(usuariosFilePath, "utf-8"));

/* BASE DE DATOS */
  const db = require('../database/models');
const sequelize = db.sequelize;
const { Op, where } = require("sequelize");
const Productos = db.Productos


//creamos el objeto literal con los metodos a exportar
const productsController = {
  // manejo del pedido get con ruta /

  detalleProd: async (req, res) => {
    const id  = req.params.id;

    const ProductosRelacionados = await Productos.findAll()

    await Productos.findByPk(req.params.id)
    .then(Productos => {
      res.render("./productos/productDetail", {Productos, ProductosRelacionados})
    })
    
  },

  detalleCarrito: (req, res) => {
    return res.render("./productos/product-cart", {
      usuario: "usuario no registrado",
    });
  },

  edicionProd: (req, res) => {
    const { id } = req.params;

    Productos.findByPk(req.params.id)
    .then(Productos => {
      res.render("./productos/edicionProduct", {Productos})
      
    });

  },

  procesoEdicion: async (req, res) => {
    let productoId = req.params.id;
    
     await Productos
    .update(
      {  
        /*
      id: req.body.id,
      nombre: req.body.nombre,
      imagenUsuario: req.body.img,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      descuento: req.body.descuento,
      talle: req.body.talle,
      color: req.body.color,
      uri_foto2: req.body.uri_foto2,
      uri_foto3: req.body.uri_foto3
     */
     
      id: req.body.id,
      nombre: req.body.nombre,
      img: req.files ? req.files[0].filename : " ",
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      descuento: req.body.descuento,
      talle: req.body.talle,
      color: req.body.color,
      uri_foto2: req.files ? req.files[1].filename : " ",
      uri_foto3: req.files ? req.files[2].filename : " ",
    
    },
    {
      where: {id: productoId}
    });

    var remerasTodas =  await db.Productos.findAll();
    return res.render("./productos/listadoProductos.ejs", {allProducts: remerasTodas});
  
    //return res.redirect("/");
  },
  
  buscarProd: async (req, res) => {
    // en loBuscado esta la descripcion que viene del formulario html
    let loBuscado = req.query.buscar.toLowerCase();
    //creo array vacio donde pondremos los productos encontrado
    let resultadoBuscar = [];


    var remerasTodas =  await db.Productos.findAll();
    // recorremos las remeras buscando coincidencia
    for (let i = 0; i < remerasTodas.length; i++) {
      if (remerasTodas[i].descripcion.toLowerCase().includes(loBuscado) || remerasTodas[i].nombre.toLowerCase().includes(loBuscado) ) {
        resultadoBuscar.push(remerasTodas[i]);
      }
    }
    // si el array resultadoBuscar no es cero lo mostramos
    if (resultadoBuscar.length){
      return res.render("./productos/listarProdBuscado", {
        allProducts: resultadoBuscar,
      });
    // sinó indicamos que no hay productos que coincidan
  } else {
    return res.render("index.ejs", { allProducts: remerasTodas ,
      errors:{ buscar: { msg: "No se encontró ningún producto"}}  }) ;
        }

  },

  destroy: async (req, res) => {
    let id = req.params.id;
    console.log("entro a borrar");
    await Productos
    .destroy({where: {id: id}, force: true}) // force: true es para asegurar que se ejecute la acción
    
    return res.render("index.ejs", { allProducts: remerasTodas })

  },

  creacionProd: (req, res) => {
    return res.render("./productos/creacionProduct");
  },

  procesoCreacion: async (req, res) => {
    /* const remeras = JSON.parse(fs.readFileSync(remerasFilePath, "utf-8")); */
    let errors = validationResult(req);
     /* console.log(req.files[0]) */
     //console.log(req.files[1]) 
     /* console.log(req.files[2]) */
 

    if(errors.isEmpty()){
            await Productos.create({
                  nombre: req.body.nombre,
                  img: req.files ? req.files[0].filename : " ",
                  descripcion: req.body.descripcion,
                  precio: req.body.precio,
                  descuento: req.body.descuento,
                  talle: req.body.talle,
                  color: req.body.color,
                  uri_foto2: req.files ? req.files[1].filename : " ",
                  uri_foto3: req.files ? req.files[2].filename : " ",
    })
    
    return res.render("./productos/creacionProduct");
    } else {
      //console.log(Productos.PRIMARY)
     return res.render("./productos/creacionProduct", 
			{errors: errors.array(),
			old: req.body })
    }
  },
  listaProduct: async (req, res) => {
    var remerasTodas =  await db.Productos.findAll();
    return res.render("./productos/listadoProductos.ejs", {
      allProducts: remerasTodas,
    });
  },

  listarProd: async (req, res) => {
    var remerasTodas =  await db.Productos.findAll();
    return res.render("./productos/listadoProductos.ejs", {
      allProducts: remerasTodas,
    });
  },

  listarProdBuscado: async (req, res) => {
    var remerasTodas =  await db.Productos.findAll();
    return res.render("./productos/listarProdBuscado.ejs", {
      allProducts: remerasTodas,
    });
  },
  
  /*
  listarVentas: async (req, res) => {
    var ventasTodas =  await db.Ventas.findAll({attributes :["numero_factura" ,  "fecha" , "total", "id_usuario"]});
    return res.render("./productos/listadoVentas.ejs", {
      ventas: ventasTodas,
    });
  },
 */
  listarVentas: (req, res) => {
    db.Ventas.findAll(
      {attributes :["numero_factura" ,  "fecha" , "total", "id_usuario"]},// * si no restrinjo atributos marca error de campo id
      {raw: true} // <-------  se agrega para que no traiga todos los metadatos que no usamos
    )
      .then((ventasTodas) => {
        return res.render("./productos/listadoVentas.ejs", {
          ventas: ventasTodas,
        });
      })
      .catch((err) => {
        res.send(err);
      });
  },










};

module.exports = productsController;
