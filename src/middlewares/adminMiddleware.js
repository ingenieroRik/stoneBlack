function  adminMiddleware  (req,res,next)  {
   
    console.log("entro a adminMiddleware");

            if (req.session.usuarioLogueado && req.session.usuarioLogueado.rol == "administrador" ){                         
                 next();                                 
             } else {
              return res.send ("No tienes los privilegios para ingresar");  
            }
            }

    module.exports = adminMiddleware;