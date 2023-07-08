  
// esta parte da un mensaje de bienvenida nombrando al usuario recien logueado
// no encontré otra forma de que funcione bien que no sea guardando un flag en localstorage

                // al presionar INICIO DE SESION se crea el flag=1 en localstorage
                function crearFlag (){
                        localStorage.setItem("flag", 1);
                }


                //console.log(localStorage.flag)



                if (localStorage.flag == 1){
                const mensaje = new SpeechSynthesisUtterance();

                // ahora recuperamos el mensaje con el nombre del usuario registrado del testo en la marquesina
                mensaje.text = document.querySelector("#texto-bienvenida").textContent;           
                speechSynthesis.speak(mensaje);

                // ponemos flag=0 para que no lo repita cuando presiona sobre la imagen para editar perfil
                localStorage.flag = 0;

                }

                // al presionar TERMINAR SESION borramos el flag del localstorage
                function borrarFlag (){
                        localStorage.removeItem("flag");
                }




          /*     

               document.querySelector("#btn-envio-login").addEventListener("click" , () => {

                console.log("cargando...............") 

            setTimeout (() => {
                    
               let holaUsuario = document.querySelector("#texto-bienvenida").textContent;
                   
                    console.log("hola");
                  console.log(holaUsuario)
                  //  const mensaje = new SpeechSynthesisUtterance();
                  //  mensaje.text = holaUsuario;
                                                                        
                   
                
                 //  speechSynthesis.speak(mensaje);

                    
                }, 15000);
                   
        })
*/







/*
  
        // let usuario = document.querySelector("#texto-bienvenida").textContent;
           //console.log(usuario);

         
            
            //document.querySelector("#btn-envio-login").addEventListener("click" , () => {

         
        //let usuario = document.querySelector("#texto-bienvenida").textContent;
              //console.log("hola")
              const mensaje = new SpeechSynthesisUtterance();
               mensaje.text = document.querySelector("#texto-bienvenida").textContent;
              //mensaje.text = usuario;
               // mensaje.text = "hola";
              speechSynthesis.speak(mensaje);
            
           
             //  })
            

  */