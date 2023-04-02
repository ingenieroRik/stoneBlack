const path = require('path');
const { body } = require('express-validator');
const sequelize = require ("sequelize"); //<------------ para usar Op
const db = require('../database/models/index.js');
//const Op = sequelize.Op;

async function imageValidatorMiddleware (req,res,next){
 
  const extensionesValidas = ['.jpg', '.jpeg', '.png', '.gif'];
 
  var remerasTodas =  await db.Productos.findAll();

   // si no hay imagen catgada no hay problemas , sigue con la siguiente validacion
  if (req.file){  // primero verificamos que hay archivo cargado

    const ext = path.extname(req.file.originalname);

    if (!extensionesValidas.includes(ext)) {  //si el array extensiones Validas  NO "incluye" la extension ext va el mensaje
  return res.render("index.ejs", { allProducts: remerasTodas ,
     errors:{ pieForm: { msg: 'Cargar archivos JPG, JPEG, PNG Y GIF'}},
      oldData : req.body}) ; 
  }} 
    next();
}
  /*
 if (!req.file){
    
  return res.render("index.ejs", { allProducts: remerasTodas ,
    errors:{ pieForm: { msg: 'Debe cargar una imagen'}},
     oldData : req.body}) ; 
 } 
  const ext = path.extname(req.file.originalname);

  if (!extensionesValidas.includes(ext)) {
 
 return res.render("index.ejs", { allProducts: remerasTodas ,
    errors:{ pieForm: { msg: 'Cargar archivos JPG, JPEG, PNG Y GIF'}},
     oldData : req.body}) ; 
 } 
    // Si todo es correcto, continuar al siguiente middleware o ruta

    next();

}
*/
module.exports = imageValidatorMiddleware;