const { json } = require("express");

const sequelize = require ("sequelize"); //<------------ para usar Op
const db = require('../../database/models/index.js');
const Op = sequelize.Op;


const usuariosAPIController = {
    'list': (req, res) => {
        db.Usuarios.findAll({attributes :["id" ,  "nombre_y_apellido" , "email"]},// solo usuarios y 3 campos
                                {where : { rol : "usuario" }})                     // id , nombre_usuario y email
                       
        .then(usuarios => {
            let respuesta = {
                meta: {
                    status : 200,
                    total: usuarios.length,
                    url: 'api/usuarios'
                },
                data: usuarios
            }
                res.json(respuesta);
            })
    },
    
    'detail': (req, res) => {
        db.Usuarios.findByPk(req.params.id,{attributes :["id" ,  "nombre_y_apellido" ,"nombre_usuario",  "email", "uri_avatar"]} ) 
                                                                            //solo campos id / nombre / nombre_usuario / email / uri_avatar(imágen)
            .then(usuarios => {
                let respuesta = {
                    meta: {
                        status: 200,
                        //total: usuarios.length,
                        url: '/api/usuarios/:id'
                    },
                    data: usuarios
                }
                res.json(respuesta);
            });
    },
}
    module.exports = usuariosAPIController;