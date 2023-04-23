const { json } = require("express");


const db = require("../database/models");

 const apiController = {

  product: async function (req, res) {
    let producto = await db.Productos.findByPk(req.params.id);
    return res.json(producto);
  },
  checkout: async function (req, res) {
    // return res.send({ ...req.body, userId: req.session.userLogged.id });
    let order = await db.Ventas.create(
      { ...req.body, userId: req.session.userLogged.id },
      {
        include: db.Ventas.OrderItems,
      }
    );
    res.json({ ok: true, status: 200, order: order });
  },
};

module.exports = apiController;