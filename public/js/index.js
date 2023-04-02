window.addEventListener('load', function() {

  const navToggle = document.querySelector(".abrir-menu");
  const menu = document.querySelector(".menu");
  
  navToggle.addEventListener("click", () => {
    menu.classList.toggle("menu_visible");
  
    if (menu.classList.contains("menu_visible")) {
      navToggle.setAttribute("aria-label", "Cerrar menú");
    } else {
      navToggle.setAttribute("aria-label", "Abrir menú");
    }
  
  })
  /***************************  para login ************************** */
  let botonEnvioLogin = document.querySelector("#btn-envio-login");
  let inputEmailLogin =document.querySelector('#form-control-login');
  let inputClaveLogin = document.querySelector("#clave-login")
  let registerForm = document.querySelector(".form-login");
  let errorNombreLogin = document.querySelector(".errorNombreLogin");
  let errorClaveLogin = document.querySelector(".errorClaveLogin");
  
    botonEnvioLogin.addEventListener('click', function(e){
              e.preventDefault();
              let errors = {}
              if(inputEmailLogin.value.length < 4){
                  errors.email = 'Escriba su email';
              }
  
              if (inputClaveLogin.value.length < 1){
                errors.clave = "Escriba su contraseña";
              }
              if(Object.keys(errors).length >= 1){
                  errorNombreLogin.innerText = (errors.email) ? errors.email : ''; 
                  errorClaveLogin.innerText = (errors.clave) ? errors.clave : '';
              } else {
              registerForm.submit();
              }
    })
  /****************************** para registrar usuario ************************************************ */
  
  let botonEnvioRegUser = document.querySelector("#btn-reg-user");
  let inputNombreRegUser = document.querySelector("#nombre");
  let inputNombreUsuarioRegUser = document.querySelector("#nombreUsuario");
  let inputEmailRegUser =document.querySelector('#emailUser');
  let inputClaveRegUser = document.querySelector("#password");
  let inputVerifClaveRegUser = document.querySelector("#confirmarpassword");
  let registerFormUser = document.querySelector(".formulario");
  let errorNombreRegUser = document.querySelector(".errorNombreRegUser");
  let errorNombreUsuarioRegUser = document.querySelector(".errorNombreUsuarioRegUser"); 
  let errorEmailRegUser = document.querySelector(".errorEmailRegUser");
  let errorClaveRegUser = document.querySelector(".errorClaveRegUser");
  let errorVerifClaveRegUser = document.querySelector(".errorVerifClaveRegUser");
  
  
    botonEnvioRegUser.addEventListener('click', function(e){
              e.preventDefault();
              let errors = {}

              if(inputNombreRegUser.value.length < 2){
                errors.nombreYapellido = 'El nombre debe tener mas de 2 caracteres';
                }
            if(inputNombreUsuarioRegUser.value.length < 2){
              errors.nombreUsuario = 'El nombre debe tener mas de 2 caracteres';
             }

              if(inputEmailRegUser.value.length < 4){
                  errors.email = 'Escriba su email';
               }
  
              if (inputClaveRegUser.value.length < 1){
                errors.clave = "Escriba su contraseña";
                }

              if (inputVerifClaveRegUser.value.length < 1){
                errors.confirmarClave = "Vuelva a escribir su contraseña";
                }


              if(Object.keys(errors).length >= 1){
                  errorNombreRegUser.innerText = (errors.nombreYapellido) ? errors.nombreYapellido : ''; 
                  errorNombreUsuarioRegUser.innerText = (errors.nombreUsuario) ? errors.nombreUsuario : '';
                  errorEmailRegUser.innerText = (errors.email) ? errors.email : '';
                  errorClaveRegUser.innerText = (errors.clave) ? errors.clave : '';
                  errorVerifClaveRegUser.innerText = (errors.confirmarClave) ? errors.confirmarClave : '';
              } else {
              registerFormUser.submit();
              }
    })

/****************************** para formulario devolver ************************************************ */
  
let botonDevolverProd = document.querySelector("#btn-dev-prod");
let inputNombreDevolver = document.querySelector("#nombre-dev");
let inputEmailDevolver =document.querySelector('#email-user-dev');
let inputFacturaDevolver = document.querySelector("#fact-dev");
let inputIDprodDevolver = document.querySelector("#id-prod-dev");
let inputFechaDevolver = document.querySelector("#fecha-dev");
let registerFormDevolver = document.querySelector(".formulario-devolver");
let errorNombreDevolver = document.querySelector(".errorNombreDev");
let errorFechaDevolver = document.querySelector(".errorFechaDev"); 
let errorEmailDevolver = document.querySelector(".errorEmailDev");
let errorFacturaDevolver = document.querySelector(".errorFactDev");
let errorIdProdDevolver = document.querySelector(".errorIdProdDev");


  botonDevolverProd.addEventListener('click', function(e){
            e.preventDefault();
            let errors = {}

            if(inputNombreDevolver.value.length < 2){
              errors.nombreYapellido = 'El nombre debe tener mas de 2 caracteres';
              }

            if(inputEmailDevolver.value.length < 4){
                errors.email = 'Escriba su email';
             }
             
            if (inputFacturaDevolver.value.length < 1){
              errors.numeroDeFactura = "Ingrese número de factura";
              }

            if (inputIDprodDevolver.value.length < 1){
                errors.idProducto = "Ingrese código de producto";
                }

            if(inputFechaDevolver.value.length < 1){
            errors.fechaDeCompra = 'Ingrese fecha de compra';
           }

            if(Object.keys(errors).length >= 1){
                errorNombreDevolver.innerText = (errors.nombreYapellido) ? errors.nombreYapellido : ''; 
                errorEmailDevolver.innerText = (errors.email) ? errors.email : '';
                errorFacturaDevolver.innerText = (errors.numeroDeFactura) ? errors.numeroDeFactura : '';
                errorIdProdDevolver.innerText = (errors.idProducto) ? errors.idProducto : '';
                errorFechaDevolver.innerText = (errors.fechaDeCompra) ? errors.fechaDeCompra : '';

                
            } else {
            registerFormDevolver.submit();
            }
  })







  
  });