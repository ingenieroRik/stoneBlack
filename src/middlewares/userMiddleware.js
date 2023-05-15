function  userMiddleware  (req,res,next)  {
   
    console.log("entro a userMiddleware");

            if (req.session.usuarioLogueado && req.session.usuarioLogueado.rol == "usuario" ){                         
                 next();                                 
             } else {
              return res.send ("Debes loguearte como ususraio");  
            }
            }

    module.exports = userMiddleware;