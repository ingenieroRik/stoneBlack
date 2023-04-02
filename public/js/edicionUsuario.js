window.addEventListener('load', function() {

    /* ***********************************para edicion de usuario ************************************ */ 
    let botonEnvioEdicUser = document.querySelector("#btn-edic-user");
    let inputNombreEdicUser = document.querySelector("#nombre");
    let inputNombreUsuarioEdicUser = document.querySelector("#nombreUsuario");
    let inputEmailEdicUser =document.querySelector('#emailUser');
    let inputClaveEdicUser = document.querySelector("#password");
    let inputVerifClaveEdicUser = document.querySelector("#confirmarpassword");
    let editFormUser = document.querySelector(".formEdicionUsuario");
    let errorNombreEdic = document.querySelector(".errorNombreEdic");
    let errorNombreUsuarioEdic = document.querySelector(".errorNombreUsuarioEdic"); 
    let errorEmailEdic = document.querySelector(".errorEmailEdic");
    let errorClaveEdic = document.querySelector(".errorClaveEdic");
    let errorVerifClaveEdic = document.querySelector(".errorVerifClaveEdic");
    
    
      botonEnvioEdicUser.addEventListener('click', function(e){
                e.preventDefault();
                let errors = {}
    
                if(inputNombreEdicUser.value.length < 2){
                  errors.nombreYapellido = 'El nombre debe tener mas de 2 caracteres';
                  }
              if(inputNombreUsuarioEdicUser.value.length < 2){
                errors.nombreUsuario = 'El nombre debe tener mas de 2 caracteres';
               }
    
                if(inputEmailEdicUser.value.length < 4){
                    errors.email = 'Escriba su email';
                 }
    
                if (inputClaveEdicUser.value.length < 1){
                  errors.clave = "Escriba su contraseña";
                  }
    
                if (inputVerifClaveEdicUser.value.length < 1){
                  errors.confirmarClave = "Vuelva a escribir su contraseña";
                  }
    
    
                if(Object.keys(errors).length >= 1){
                    errorNombreEdic.innerText = (errors.nombreYapellido) ? errors.nombreYapellido : ''; 
                    errorNombreUsuarioEdic.innerText = (errors.nombreUsuario) ? errors.nombreUsuario : '';
                    errorEmailEdic.innerText = (errors.email) ? errors.email : '';
                    errorClaveEdic.innerText = (errors.clave) ? errors.clave : '';
                    errorVerifClaveEdic.innerText = (errors.confirmarClave) ? errors.confirmarClave : '';
                } else {
                editFormUser.submit();
                }
      });
      
    
    
    
    });
    