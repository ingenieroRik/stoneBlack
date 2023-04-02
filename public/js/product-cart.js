/* function setCarritoVacio(){
    cartRows.innerHtml =


}
 */
function vaciarCarrito () {

    localStorage.removeItem ("carrito");
}

function calcularTotal (products) {
    /*el reduce sirve para un array de objetos hacerle el calculo entre sus componentes y sumarlos
    /*La funcion reduce para acumular y devolver un total, acepta un acumular y un producto que tb puede ser un items y ese itemns con el 2 parametro de la funcion le decimos que empiece con 0 y el acum va a sumar el precio del producto y la cantidad del producto..osea a cada items se lo multiplica por el precio por la cantida que se compray el reduce es como un foreach..en el foreach va a pasar por todos los items de ese array haciendo la cuenta de multiplicacion y los va guardando y sumando al acumulador al final de ese reduce nos devuelve el total de lo que sale la cuenta  
    */return products.reduce (

        (acum,Productos) => (acum += Productos.precio * Productos.cantidad),0
    );
}

if (localStorage.carrito) {

    let carrito = JSON.parse (localStorage.carrito); //traigo el carrito y lo parseo
    console.log (carrito); --/* aparece en inspeccionar consola los productos que compramos en el carrito
    --me va a aparecer solo id, la cantidad y no esta el precio porque si viene una persona un mes despues y compra al precio del mes pasado porque quedo asi guardado en localStorage por eso siempre lo que va a ser inmutable es el id de producto y la cantidad  */
carrito.forEach((item,index)=> {      /* --para mostrar el producto hago un forEach por cada uno de los productos */
   fetch (`/api/product/${item.id}`) 
   .then ((res) => res.json())
   .then ((product) => {
    console.log (product);
   }
    )
});
     
};

