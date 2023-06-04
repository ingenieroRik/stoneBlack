
const mercadopago = require ("mercadopago");

const db = require('../database/models');
const sequelize = db.sequelize;
const { Op, where } = require("sequelize");
const { json } = require("express");

const path = require("path");


const paymentMercadopagoController = {

 

createOrder : async (req, res) => {
  mercadopago.configure({
    access_token: process.env.MERCADOPAGO_API_KEY
  });
  
  try {
    const numeroFactura = req.params.id
  const ventas = await db.Ventas.findAll(
    {attributes :["numero_factura" , "id_usuario", "total"],// * si no restrinjo atributos marca error de campo id 
    raw: true,// <-------  se agrega para que no traiga todos los metadatos que no usamos
            where: {numero_factura: numeroFactura},
       });
      

       // verioficamos identidad, deben ser igual el loguedo que el que compro y esta guardado en base de datos
       let user1 = ventas[0].id_usuario;
       let user2 = req.session.usuarioLogueado.id;

       if (user1 == user2) {
              const precio = parseInt(ventas[0].total);  //lo trae en un array por eso el [0]
              const titulo = "Número de factura: " + ventas[0].numero_factura;
              //console.log(venta[0].total);

            const result = await mercadopago.preferences.create({
              items: [
                {
                  title: titulo,
                  unit_price: precio,
                  currency_id:"ARS",
                  quantity: 1,
                },
              ],
              // notification_url: "https://e720-190-237-16-208.sa.ngrok.io/webhook",
              back_urls: {
                  success: "http://localhost:3044/success",
                  // pending: "https://e720-190-237-16-208.sa.ngrok.io/pending",
                  // failure: "https://e720-190-237-16-208.sa.ngrok.io/failure",
              },
              });

              //console.log(result);

              //res.send("creando orden");
              
              res.json(result.body);
            } else{

              res.send("Algo salió mal, intente mas tarde");
            }
              } catch (error) {
              return res.status(500).json({ message: "Something goes wrong" });
             }
            
        },

 receiveWebhook : async (req, res) => {
  try {
    const payment = req.query;
    console.log(payment);
    if (payment.type === "payment") {
      const data = await mercadopago.payment.findById(payment["data.id"]);
      console.log(data);
    }

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something goes wrong" });
  };
   
},
}
module.exports = paymentMercadopagoController;