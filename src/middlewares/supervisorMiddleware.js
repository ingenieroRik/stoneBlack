function supervisorMiddleware (req,res,next){
    //console.log("supervisorMIddleware");
    //console.table(req.session.usuarioLogueado );
    
        if (req.session.usuarioLogueado && req.session.usuarioLogueado.rol == "supervisor"){
                             
                next();                
                           
            } else {
                             return res.send ("No tienes los privilegios para ingresar");      
    }
};

module.exports = supervisorMiddleware;