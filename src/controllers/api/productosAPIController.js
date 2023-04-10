const { json } = require("express");

const sequelize = require("sequelize"); //<------------ para usar Op
const db = require("../../database/models");
const path = require('path');
const Op = sequelize.Op;

const productosAPIController = {
  'list': (req, res) => {
    db.Productos.findAll()
    .then(productos => {
      let respuesta = {
        meta: {
          status: 200,
          total: productos.length,
          url: "https://stoneblack.onrender.com/api/productos",
        },
        data: productos,
      };
      res.json(respuesta);
    });
  },

  detail: (req, res) => {
    db.Productos.findByPk(req.params.id)
      //solo campos id / nombre / nombre_usuario / email / uri_avatar(imágen)
      .then(productos => {
        let respuesta = {
          meta: {
            status: 200,
            total: productos.length,
            url: "/api/productos/:id",
          },
          data: productos,
        };
        res.json(respuesta);
      });
  },
};


module.exports = productosAPIController;
