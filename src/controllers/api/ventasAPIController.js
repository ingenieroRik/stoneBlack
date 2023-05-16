const { json } = require("express");

const sequelize = require ("sequelize"); //<------------ para usar Op
const db = require('../../database/models/index.js');
const Op = sequelize.Op;


const ventasAPIController = {
    'list': (req, res) => {
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

    checkout: async function (req, res) {
        try {
        //return res.send({ ...req.body, userId: JSON.parse(req.session.usuarioLogueado.id)});
        
        
        
        let ventas = await db.Ventas.create(
          { ...req.body, id_usuario: req.session.usuarioLogueado.id },
          {
            include: db.Ventas.Productos_por_venta,
          }
        );
        res.json({ ok: true, status: 200, ventas: ventas });

    } catch (error) {
        return res.status(500).json({ message: error.message });
      }
      },

       /*
    'checkout': (req, res) => {
       
         db.Ventas.create(
          { ...req.body, userId: req.session.userLogged.id },
          {
            include: db.Ventas.Productos_por_venta,
          }
        ).then(ventas => {
            let respuesta = {
                meta: {
                    status : 200,
                    total: ventas.total,
                    url: '/api/ventas/checkout'
                },
                data: ventas
            }


        res.json({ ok: true, status: 200, order: ventas });
      })
    }

    /*
    'detail': (req, res) => {
        db.Usuarios.findByPk(req.params.id,{attributes :["id" ,  "nombre_y_apellido" ,"nombre_usuario",  "email", "uri_avatar"]} ) 
                                                                            //solo campos id / nombre / nombre_usuario / email / uri_avatar(imágen)
            .then(usuarios => {
                let respuesta = {
                    meta: {
                        status: 200,
                        //total: usuarios.length,
                        url: 'https://stoneblack.onrender.com/api/ventas/:id'
                    },
                    data: usuarios
                }
                res.json(respuesta);
            });
    },
    */
}
    module.exports = ventasAPIController;