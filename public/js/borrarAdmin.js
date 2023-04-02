

let formBorrarAdmin = document.querySelector(".form-borrar-admin");

function eliminar_admin (event) {
    let borrar = confirm ("¿seguro quiere borrar este usuario/administrador?");
    
 if (!borrar){
        console.log(" no borrar");
        event.preventDefault();
        return
    } else {
        console.log("borrar");
        
        formBorrarAdmin.submit()

    }
}
