  

window.onload = function () {

  
  
            //const usuario = document.querySelector("#texto-bienvenida").textContent;
            //console.log(usuario);
            //document.querySelector("#boton-envio-login").addEventListener("click",() => {

            let usuario = document.querySelector("#texto-bienvenida").textContent;
            console.log(usuario);

                const mensaje = new SpeechSynthesisUtterance();
                mensaje.text = usuario;
                speechSynthesis.speak(mensaje);
       // })
    }
    
  