

function loginVacioMiddleware (req, res, next){


    if (req.session.usuarioLogueado){
        res.locals.loginVacio = false;// hay alguien por loguearse
        res.locals.loginVacio = false;// hay alguien por loguearse   
        
        next();
    }else {
    res.locals.loginVacio = false;
    console.log("no hay nadie por loguerase sigo con next");
        next(); // no hay nadie por loguerase sigo con next
    }
}

module.exports = loginVacioMiddleware;