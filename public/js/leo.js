function productosEnElCarrito (){
    /*hago un return del localStorage.carrito preguntado ? sy hay parseo el JSON localStorage.carrito y con length se le saca la cantida de items que tiene y sino devuelve 0*/
    return localStorage.carrito? JSON.parse (localStorage.carrito).length:0;
    }
    
    window.addEventListener ("load", function() {
        /* Animacion*/
        new WOW ().init();
    
      /*son varios botones comprar porque va a haber muchos productos por eso va querySelectorAll*/
        
      let botonesComprar = document.querySelectorAll ('.boton-comprar');
      /*devuelve el primer elemento que es el carrit de compras*/
      let carritoCompras = document.querySelector (".carrito-compras");
    
    //console.log (botonesComprar);
    
       /*cada vez que se actualice la compra se crea el innerttext*/
       /*luego del igual tengo que traer si hay un localStorage tengo que hacerle un length al carrito y si no hay localStorage no se agrega nada es 0*/
       /* antes de hacer el foreach lo primero que hay que hacer es setear cuando arranca la pag que la funcion productosEnElCarrito porque cuando estaba debajo del foreach me arrancaba el carrito en 0 en cambio ahora haciendo un F5 me deja la cantidad de comprar que habia en el carrito*/
       carritoCompras.innerText = productosEnElCarrito()    
       
       
       botonesComprar.forEach((boton) => {
        
        //escuchar el click
    
        boton.addEventListener ("click", (e) =>{
          //console.log (e.target.dataset.id);
          /*Hay carrito en local storage*/
         if (localStorage.carrito){
         //se que se hace si ya hay carrito
         let carrito = JSON.parse (localStorage.carrito);
    
         let index = carrito.findIndex ((prod)=> prod.id = e.target.dataset.id);
         if (index !=-1){
          carrito[index].cantidad ++
         }else{
          carrito.push ({id:e.target.dataset.id, cantidad: 1})
         } 
         localStorage.setItem ('carrito',JSON.stringify(carrito));
         /*si el producto esta en el carrito le sumo 1*/
         /*sino lo agrego con un push*/
         }else{
          localStorage.setItem ('carrito', JSON.stringify(carrito)
          )
         }
         /* es un aviso, se debe en el head crear el link  <link href ="/vendor/toastr/toastr.css rel "stylesheet">
         y en el script product.js <script src ="/vendor/toastr/toastr.js></script>*/
        
         toastr.sucess("Se agregó este producto al carrito")
    
           
           
        })
    
    
    
      });
    
    
    
    });
    /*
    -Para que que alguien pueda comprar tiene que estar usuarioLogueado para mandar el id del usuario sin pedirle que loguee
    
    -En la ruta get el product-cart que esta en routers  rutaProductos.js hay que agregar el authMiddleware de usuarioa usuarioLogueado
    
    router.get ('/product-cart', usuarioLogueadoMiddleware, productsController.detalleCarrito);
    
    -abajo esta detallado authMiddleware de la ruta get del carrito 
    
    -tambien se deberia requerir en rutaProductos el authMiddleware de usuarioLogueado
    
    const usuarioLogueadoMiddleware = require('../middlewares/usuarioLogueadoMiddleware.js');
    
    
    En la carpeta middlewares, archivo authMiddleware.js que tenga adentro
    
    authMiddleware = (req,res,next) ={
      if (!req.session.usuarioLogueado) { 
        return res.redirect ("/")
      }
      next ();
    };
    
    module.exports = authMiddleware;
    
    -Despues agregar es srcipt del product-cart...se va a creat product-cart.js