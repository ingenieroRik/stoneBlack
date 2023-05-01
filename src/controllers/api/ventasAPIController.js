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
            })
    },
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