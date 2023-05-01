window.onload = function () {

  /* FUNCION PARA ENVIAR INFO AL CARRITO */
/*
   function agregarAlCarrito() {
    var talle = document.getElementById("talle").value;
    var cantidad = document.getElementById("cantidad").value;
    var nombreProducto = document.getElementById("nombreProducto").textContent;
    var precio = document.getElementById("precio").textContent.substring(1);
    var colores = [];
 */

  // Obtiene los checkboxes de color
  var checkboxes = document.getElementsByName("color"); 

   // Recorre los checkboxes y agrega los colores seleccionados a la lista
    for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      colores.push(checkboxes[i].value);
    }
  }

  /*
    var item = {
      nombreProducto: nombreProducto,
      precio: precio, 
      talle: talle,
      cantidad: cantidad,
      colores: colores
    };
  */


    /*
    var carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    // Vaciar el arreglo del carrito antes de agregar un nuevo elemento
    carrito = [];
    carrito.push(item);
    localStorage.setItem("carrito", JSON.stringify(carrito));
  
    alert("El item se ha agregado al carrito.");
  }

  let form = document.querySelector("#form")

  form.addEventListener("submit", function(e){
     e.preventDefault();
      agregarAlCarrito();
     form.submit();
     console.log(JSON.parse(localStorage.getItem("carrito")))
  })
 */


  /* CSS PARA VER SELECCIONADOS LOS COLRES */

  const efectoColores = document.querySelectorAll('input[type="checkbox"]');
  efectoColores.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      const isChecked = this.checked;
      const parentLabel = this.parentNode;
      if (isChecked) {
        parentLabel.classList.add('border');
      } else {
        parentLabel.classList.remove('border');
      }
    });
  });

  /* CARRUSEL DE PRODUCTOS RELACIONADOS */
  const carrusel = document.querySelector(".carrusel-items");

  let maxScrollLeft = carrusel.scrollWidth - carrusel.clientWidth;
  let intervalo = null;
  let step = 1;

  const start = () => {
    intervalo = setInterval(function () {
      carrusel.scrollLeft = carrusel.scrollLeft + step;
      if (carrusel.scrollLeft === maxScrollLeft) {
        step = step * -1;
      } else if (carrusel.scrollLeft === 0) {
        step = step * -1;
      }
    }, 10);
  };

  const stop = () => {
    clearInterval(intervalo);
  };

  carrusel.addEventListener("mouseover", () => {
    stop();
  });

  carrusel.addEventListener("mouseout", () => {
    start();
  });

  start();

  
};

