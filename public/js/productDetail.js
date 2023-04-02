window.onload = function () {
  /* FUNCION PARA ENVIAR INFO AL CARRITO */

  /* function agregarAlCarrito() {
    var talle = document.getElementById("talle").value;
    var cantidad = document.getElementById("cantidad").value;
    var colores = [];
 */
  // Obtiene los checkboxes de color
/*   var checkboxes = document.getElementsByName("color"); */

   // Recorre los checkboxes y agrega los colores seleccionados a la lista
  /*  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      colores.push(checkboxes[i].value);
    }
  }
  
    var item = {
      talle: talle,
      cantidad: cantidad,
      colores: colores
    };
  
    var carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(item);
    localStorage.setItem("carrito", JSON.stringify(carrito));
  
    alert("El item se ha agregado al carrito.");
  }
 */

  /* CSS PARA VER SELECCIONADOS LOS COLRES */

  let colorSelec = document.querySelectorAll("#label")

  colorSelec.addEventListener("click",function(e){

      colorSelec.classList.add("border");

    })

   /*  if (colorSelec.classList.contains("border")) {
      colorSelec.classList.remove("border");
    } else { */

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
