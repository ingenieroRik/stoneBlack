window.onload = function () {
    let nombre = document.querySelector("#nombre")
    let descripcion = document.querySelector("#descripcion")
    let talle = document.querySelector("#talle")
    let color = document.querySelector("#color")
    let precio = document.querySelector("#precio")
    let descuento = document.querySelector("#descuento")
    let img = document.querySelector("#img")
    let img2 = document.querySelector("#img2")
    let img3 = document.querySelector("#img3")
    let btnCargar = document.querySelector("#btnCargar")
    let form = document.querySelector("#form")
    let ulErrores = document.querySelector("#ul")
    let btnBorrar = document.querySelector("#btnBorrar")

    nombre.focus()

    btnCargar.addEventListener("click", function (e) {

        let errors = {}

        if (nombre.value.length < 2) {
            errors.nombre = "Debes completar con un nombre valido"
        }

        if (descripcion.value.length < 6) {
            errors.descripcion = "Debes completar con una descripcion valida"
        }

        if (talle.value.length < 1) {
            errors.talle = "Debes completar con un talle valido"
        }

        if (color.value.length <= 3) {
            errors.color = "Debes completar con un color valido"
        }

        if (precio.value.length < 4) {
            errors.precio = "Debes completar con un precio valido"
        }

        if (descuento.value.length < 1) {
            errors.descuento = "Debes completar con un descuento valido"
        }

        if (img.value.length < 4) {
            errors.img = "Debes completar con un imagen valida"
        }

        if (img2.value.length < 3) {
            errors.img2 = "Debes completar con un imagen 2 valida"
        }

        if (img3.value.length < 3) {
            errors.img3 = "Debes completar con un imagen 3 valida"
        }

        console.log(errors)

        if (Object.keys(errors).length >= 1) {
            e.preventDefault()
            ulErrores.innerHTML = " ";
            ulErrores.innerHTML += (errors.nombre) ? "<li>" + errors.nombre + "</li>" : " ";
            ulErrores.innerHTML += (errors.descripcion) ? "<li>" + errors.descripcion + "</li>" : " ";
            ulErrores.innerHTML += (errors.talle) ? "<li>" + errors.talle + "</li>" : " ";
            ulErrores.innerHTML += (errors.color) ? "<li>" + errors.color + "</li>" : " ";
            ulErrores.innerHTML += (errors.precio) ? "<li>" + errors.precio + "</li>" : " ";
            ulErrores.innerHTML += (errors.descuento) ? "<li>" + errors.descuento + "</li>" : " ";
            ulErrores.innerHTML += (errors.img) ? "<li>" + errors.img + "</li>" : " ";
            ulErrores.innerHTML += (errors.img2) ? "<li>" + errors.img2 + "</li>" : " ";
            ulErrores.innerHTML += (errors.img3) ? "<li>" + errors.img3 + "</li>" : " ";
        } else {
            ulErrores.innerHTML = " ";
            form.submit();
            alert("Producto modificado con exito")
        }
    })

    //BOTON BORRAR ARTICULO

    btnBorrar.addEventListener("click", function(e){
        e.preventDefault()

         let confirma = confirm("¿Seguro deseas eliminar este articulo?")

        if (confirma) {
            form.submit()
        } else {
            e.preventDefault()
        } 
    })

     //BOTON VOLVER PAGINA ANTERIOR
     
     let btnVolver= document.querySelector("#btnVolver")

     btnVolver.addEventListener("click", function(e){
         history.go(-1)
     })
 
}
