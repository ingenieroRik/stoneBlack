
//const {
 // createOrder,
 // receiveWebhook,
//} = require ("../controllers/payment.mercadopago.controller.js");

let express = require ('express');
let router = express.Router();
let path = require('path');

const userMiddleware = require('../middlewares/userMiddleware.js');

const paymentMercadopagoController = require ("../controllers/paymentMercadopagoController.js");


router.post("/create-order/:id", userMiddleware, paymentMercadopagoController.createOrder);

router.post("/webhook", userMiddleware, paymentMercadopagoController.receiveWebhook);

router.get("/success", (req, res) => res.redirect("/"));

module.exports = router;