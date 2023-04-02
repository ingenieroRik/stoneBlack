

let formBorrar = document.querySelector(".form-borrar");

function eliminar_usuario (event) {
    let borrar = confirm ("¿seguro quiere borrar este usuario?");
    
 if (!borrar){
        console.log(" no borrar");
        event.preventDefault();
        return
    } else {
        console.log("borrar");
        
        formBorrar.submit()

    }
}
