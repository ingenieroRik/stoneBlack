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
    try {
    const id  = req.params.id;

    const ProductosRelacionados = await Productos.findAll()

    await Productos.findByPk(req.params.id)
    .then(Productos => {
      res.render("./productos/productDetail", {Productos, ProductosRelacionados})
    })

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  detalleCarrito: (req, res) => {
    return res.render("./productos/product-cart", {
      usuario: "usuario no registrado",
    });
  },

  edicionProd: (req, res) => {
    try {
    const { id } = req.params;

    Productos.findByPk(req.params.id)
    .then(Productos => {
      res.render("./productos/edicionProduct", {Productos})
      
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  },

  procesoEdicion: async (req, res) => {
    try {
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
      img: req.file ? req.file.filename : " ",
     //img: req.files ? req.files[0].filename : " ",
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      descuento: req.body.descuento,
      talle: req.body.talle,
      color: req.body.color,
     // uri_foto2: req.files ? req.files[1].filename : " ",
      //uri_foto3: req.files ? req.files[2].filename : " ",
      cantidad: req.body.cantidad
    },
    {
      where: {id: productoId}
    });

    var remerasTodas =  await db.Productos.findAll();
    return res.render("./productos/listadoProductos.ejs", {allProducts: remerasTodas});

    } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  },
  

  buscarProd: async (req, res) => {
    try {
    // en descripcion esta lo que hay que buscar que viene del formulario html
    let descripcion = req.query.buscar.toLowerCase();
    console.log(req.query.buscar);
    console.log(req.query.talle);
    console.log(req.query.color);

      //creo array vacio donde pondremos los productos encontrado
    let resultadoBuscar = [];

    // ---------------- nombre/descripcion talle:todos color:todos ---------------------------------------------------------
    if (req.query.color == "Todos" && req.query.talle == "Todos"){
          // buscamos en la BBDD color y talle primero
    let resultadoColorTalle =  await db.Productos.findAll(
    );
      
       // si hay talle y color entonces el array resultadoBuscar no es cero lo mostramos
    if (resultadoColorTalle.length > 0){
      // recorremos el array buscando coincidencia de nombre o descripcion
    for (let i = 0; i < resultadoColorTalle.length; i++) {
      if (resultadoColorTalle[i].descripcion.toLowerCase().includes(descripcion) ||
                           resultadoColorTalle[i].nombre.toLowerCase().includes(descripcion))  {
              resultadoBuscar.push(resultadoColorTalle[i]);
             }
            }
             if (resultadoBuscar.length){
           
        return res.render("./productos/listarProdBuscado", {
          allProducts: resultadoBuscar,
        });

      // sinó indicamos que no hay productos que coincidan
          } else {
            var remerasTodas =  await db.Productos.findAll();
            return res.render("index.ejs", { allProducts: remerasTodas ,
              errors:{ buscar: { msg: "No se encontró ningún producto"}}  }) ;
                }
                        
            }

    // ----------------------         nombre/descripcion  color:todos talle:talle  -----------------------------------------------
    } else if (req.query.color == "Todos"){
          // buscamos en la BBDD talle primero
    let resultadoColorTalle =  await db.Productos.findAll(
      { where: { talle: req.query.talle }}
      );
        // si hay talle entonces el array resultadoBuscar no es cero lo mostramos
         if (resultadoColorTalle.length){
  
        // recorremos el array buscando coincidencia de nombre o descripcion
        for (let i = 0; i < resultadoColorTalle.length; i++) {
          if (resultadoColorTalle[i].descripcion.toLowerCase().includes(descripcion) ||
                             resultadoColorTalle[i].nombre.toLowerCase().includes(descripcion))  {
          resultadoBuscar.push(resultadoColorTalle[i]);
        }
      }
            if (resultadoBuscar.length){
           return res.render("./productos/listarProdBuscado", {
                     allProducts: resultadoBuscar,
          });
          
          // sinó indicamos que no hay productos que coincidan
         } else {
          var remerasTodas =  await db.Productos.findAll();
          return res.render("index.ejs", { allProducts: remerasTodas ,
            errors:{ buscar: { msg: "No se encontró ningún producto"}}  }) ;
        }
      }   


      // -----------------------------------   nombre/descripcion  color:color  talle:todos ----------------------------------------------
      } else if (req.query.talle == "Todos"){

        // buscamos en la BBDD color y talle primero
    let resultadoColorTalle =  await db.Productos.findAll(
      { where: { color: req.query.color }}
      );
        
         // si hay talle y color entonces el array resultadoBuscar no es cero lo mostramos
         if (resultadoColorTalle.length){
  
        // recorremos el array buscando coincidencia de nombre o descripcion
        for (let i = 0; i < resultadoColorTalle.length; i++) {
          if (resultadoColorTalle[i].descripcion.toLowerCase().includes(descripcion) ||
                             resultadoColorTalle[i].nombre.toLowerCase().includes(descripcion))  {
          resultadoBuscar.push(resultadoColorTalle[i]);
        }
      }
          
           if (resultadoBuscar.length){
             return res.render("./productos/listarProdBuscado", {
                     allProducts: resultadoBuscar,
          });

            // sinó indicamos que no hay productos que coincidan
         } else {
          var remerasTodas =  await db.Productos.findAll();
          return res.render("index.ejs", { allProducts: remerasTodas ,
            errors:{ buscar: { msg: "No se encontró ningún producto"}}  }) ;
        }

    }
   // ----------------------------  nombre/descipcion  talle:talle color:color -------------------------------------------
      } else  {
           // buscamos en la BBDD color y talle primero
    let resultadoColorTalle =  await db.Productos.findAll(
      { where: {
        [Op.and]: [
          { talle: req.query.talle },
          { color: req.query.color },
        ],
       },
      }
    );
    // si hay talle y color entonces el array resultadoBuscar no es cero lo mostramos
    if (resultadoColorTalle.length){

      // recorremos el array buscando coincidencia de nombre o descripcion
    for (let i = 0; i < resultadoColorTalle.length; i++) {
      if (resultadoColorTalle[i].descripcion.toLowerCase().includes(descripcion) ||
                           resultadoColorTalle[i].nombre.toLowerCase().includes(descripcion))  {
        resultadoBuscar.push(resultadoColorTalle[i]);
      }
    }
        
       if (resultadoBuscar.length){
             return res.render("./productos/listarProdBuscado", {
                     allProducts: resultadoBuscar,
      });
    // sinó indicamos que no hay productos que coincidan
        } else {
          var remerasTodas =  await db.Productos.findAll();
          return res.render("index.ejs", { allProducts: remerasTodas ,
            errors:{ buscar: { msg: "No se encontró ningún producto"}}  }) ;
          }
        }
      }
           
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    },
    




 /*
  //sin opción todos
  buscarProd1: async (req, res) => {
    try {
    // en descripcion esta lo que hay que buscar que viene del formulario html
    let descripcion = req.query.buscar.toLowerCase();
    console.log(req.query.buscar);
    console.log(req.query.talle);
    console.log(req.query.color);
   
    //creo array vacio donde pondremos los productos encontrado
    let resultadoBuscar = [];

      // buscamos en la BBDD color y talle primero
    let resultadoColorTalle =  await db.Productos.findAll(
      { where: {
        [Op.and]: [
          { talle: req.query.talle },
          { color: req.query.color },
        ],
       },
      }
    );

    // si hay talle y color entonces el array resultadoBuscar no es cero lo mostramos
    if (resultadoColorTalle.length){

      // recorremos el array buscando coincidencia de nombre o descripcion
    for (let i = 0; i < resultadoColorTalle.length; i++) {
      if (resultadoColorTalle[i].descripcion.toLowerCase().includes(descripcion) ||
                           resultadoColorTalle[i].nombre.toLowerCase().includes(descripcion))  {
        resultadoBuscar.push(resultadoColorTalle[i]);
      }
    }
      return res.render("./productos/listarProdBuscado", {
        allProducts: resultadoBuscar,
      });
    // sinó indicamos que no hay productos que coincidan
        } else {
          var remerasTodas =  await db.Productos.findAll();
          return res.render("index.ejs", { allProducts: remerasTodas ,
            errors:{ buscar: { msg: "No se encontró ningún producto"}}  }) ;
              }

      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
  },
*/

  
  destroy: async (req, res) => {
    try {
   
    var remerasTodas =  await db.Productos.findAll();
    console.log("entro a borrar producto");
    await Productos.destroy({where: {id:req.params.id}, force: true}) // force: true es para asegurar que se ejecute la acción
    
    return res.render("./productos/listadoProductos.ejs", { allProducts: remerasTodas })
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  },

  creacionProd: (req, res) => {
    return res.render("./productos/creacionProduct");
  },

  procesoCreacion: async (req, res) => {
    try {
    /* const remeras = JSON.parse(fs.readFileSync(remerasFilePath, "utf-8")); */
    let errors = validationResult(req);
     /* console.log(req.files[0]) */
     //console.log(req.files[1]) 
     /* console.log(req.files[2]) */
 

    if(errors.isEmpty()){
            await Productos.create({
                  nombre: req.body.nombre,
                  img: req.file ? req.file.filename : " ",
                  //img: req.files ? req.files[0].filename : " ",
                  descripcion: req.body.descripcion,
                  precio: req.body.precio,
                  descuento: req.body.descuento,
                  talle: req.body.talle,
                  color: req.body.color,
                  uri_foto2: req.files ? req.files[1].filename : " ",
                  uri_foto3: req.files ? req.files[2].filename : " ",
                  cantidad: req.body.cantidad
    })
    
    return res.render("./productos/creacionProduct");
    } else {
      //console.log(Productos.PRIMARY)
     return res.render("./productos/creacionProduct", 
			{errors: errors.array(),
			old: req.body })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  },

  listaProduct: async (req, res) => {
    try {
    var remerasTodas =  await db.Productos.findAll();
    return res.render("./productos/listadoProductos.ejs", {
      allProducts: remerasTodas,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  },

  listarProd: async (req, res) => {
    try { 
    var remerasTodas =  await db.Productos.findAll();
    return res.render("./productos/listadoProductos.ejs", {
      allProducts: remerasTodas,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  },

  listarProdBuscado: async (req, res) => {
    try {
    var remerasTodas =  await db.Productos.findAll();
    return res.render("./productos/listarProdBuscado.ejs", {
      allProducts: remerasTodas,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
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
    try {
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

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  pedido: async function (req, res) {
    try {
    //let numero_factura = req.params.id
    let ventas = await db.Ventas.findAll(
    {attributes :["numero_factura" ,  "fecha" , "total", "id_usuario"],// * si no restrinjo atributos marca error de campo id 
    raw: true,// <-------  se agrega para que no traiga todos los metadatos que no usamos
      where: {numero_factura: req.params.id},
      //include: db.Ventas.Productos_por_venta
    }
    );
    //return res.send("ordenCompra");
   // console.log(req.params.id)
   
    //console.log(ventas)
    //console.log(ventas[0].numero_factura)
    return res.render("./productos/ordenCompra.ejs", { ventas : ventas });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  },
  /*
  pedido: (req, res) => {
    db.Ventas.findByPk(req.params.numero_factura).then((ventas) => {
      res.render("./productos/ordenCompra.ejs", { ventas: ventas });
    });

  },
  */

  detalleCompra: async (req, res) => {
    //try {
      console.log(req.params.id)
    let productos_por_venta = await db.Productos_por_venta.findAll({
      where: {id_venta : req.params.id},});
     //console.log(productos_por_venta);
      res.render("./productos/detalleCompra.ejs", { productos_por_venta : productos_por_venta ,
      id_venta : req.params.id });
    
  //} catch (error) {
   // return res.status(500).json({ message: error.message });
 // }

  },
  /*
  detalleCompra: (req, res) => {
    db.Productos_por_venta.findByPk(req.params.numero_factura).then((productos_por_venta) => {
      res.render("./productos/detalleCompra.ejs", { productos_por_venta : productos_por_venta });
    });

  },
  */

};

module.exports = productsController;
