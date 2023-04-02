const db = require('../database/models/index.js'); //<----------------

async function usuarioLogueadoMiddleware (req, res,next){

    //console.table(req.session.usuarioLogueado);
    
    if (req.session  && req.session.usuarioLogueado){ 
        res.locals.isLogged = true;
        res.locals.usuarioLogueado = req.session.usuarioLogueado;
    } else {
            res.locals.isLogged = false;

       //console.log(req.cookies.usuarioEmail);
        if (req.cookies.usuarioEmail){

       let usuario = await db.Usuarios.findOne({
                where : { email : req.cookies.usuarioEmail },  //<---- busco en la tabla usuarios si existe el mail que viene del body
                 raw : true,      // <-------  se agrega para que no traiga todos los metadatos que no usamos
            })
    
            if ( usuario.rol == "usuario") {

                res.locals.isLogged = true; //<------------- ahora hay un usuario logeado , el que esta en la cookie 

                req.session.usuarioLogueado = usuario ; //<--------  debo cargar el usuario que encontré
                res.locals.usuarioLogueado = req.session.usuarioLogueado; //  en locals para que lo muestre el ejs         
            };  
           };
    };
    next();
    
}


module.exports = usuarioLogueadoMiddleware;