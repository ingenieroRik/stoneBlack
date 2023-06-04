const { json } = require("express");


const path = require("path");

const { sequelize } = require('../../database/models'); // <-------------------- para usar transaction
const Op = sequelize.Op;

const db = require("../../database/models");

const ventasAPIController = {
    list: (req, res) => {
        db.Ventas.findAll({attributes :["numero_factura" ,  "fecha" , "total"]})// solo usuarios y 3 campos
                                                  // id , nombre_usuario y email
                       
        .then(ventas => {
            let respuesta = {
                meta: {
                    status : 200,
                    total: ventas.length,
                    url: '/api/ventas'
                },
                data: ventas
            }
                res.json(respuesta);
            }).catch(err => {  
                res.send(err)
                });
    },

    /***************************************************************************************************************************** */
    checkout: async function (req, res) {

        // Primero, iniciamos una transacción y la guardamos en una variable ver: https://runebook.dev/es/docs/sequelize/manual/transactions
            const t = await sequelize.transaction();  
          

       try {
     

        let ventas = await db.Ventas.create(
          { ...req.body, id_usuario: req.session.usuarioLogueado.id },
          { transaction: t }      
             );

            // necesitamos saber el numero de factura que es el id de la venta que se generó recien
            // para cargarlos en productos_por_venta
            let numeroFactura = ventas.numero_factura;

           //console.log(req.body.productos_por_venta);
           //console.log(req.body.productos_por_venta[0].productId);
           //console.log(req.body.numero_factura)
        
        for (let i=0; i < req.body.productos_por_venta.length; i++){
            /*
           let idProducto = req.body.productos_por_venta[0].productId;
            let talle = req.body.productos_por_venta[0].talle;
            let color = req.body.productos_por_venta[0].color;
            let precio = req.body.productos_por_venta[0].precio;
            let cantidad = req.body.productos_por_venta[0].cantidad;
            */
            await db.Productos_por_venta.create({
          
                id_producto : req.body.productos_por_venta[i].productId,
                talle : req.body.productos_por_venta[i].talle,
                color : req.body.productos_por_venta[i].color,
                precio_unitario : req.body.productos_por_venta[i].precio,
                cantidad : req.body.productos_por_venta[i].cantidad,
                id_venta:numeroFactura
            }, 
            { transaction: t }
            )
            //debemos sacar del stock los prodcutos vendidos
            // va dentro del for porque pueden ser varios productos

            let valor = req.body.productos_por_venta[i].cantidad;

            await db.Productos.decrement(
                    { cantidad :  valor }, { where : {id: req.body.productos_por_venta[i].productId,}}, 
                    { transaction: t }
            )
        }
            
            // Si la ejecución llega a esta línea, no se arrojaron errores.
            // Confirmamos la transacción.
            await t.commit();

            res.json({ ok: true, status: 200, ventas: ventas });

       } catch (error) {


             // Si la ejecución llega a esta línea, se arrojó un error.
            // Revertimos la transacción.
            await t.rollback();
            return res.status(500).json({ message: error.message });
        } 
      },


    
}
    module.exports = ventasAPIController;