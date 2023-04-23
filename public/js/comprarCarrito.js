function removeItem(index) {
    if (carrito.length > 1) {
      carrito.splice(index, 1);
      products.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      document.getElementById(`row${index}`).remove();
    } else {
      localStorage.removeItem("carrito");
      products = [];
      setCarritoVacio();
    }
  
    let cartNumber = document.querySelector(".cart-number");
    cartNumber.innerText = productsEnElCarrito();
  
    document.querySelector(".totalAmount").innerText = `$ ${calcularTotal(
      products
    )}`;
  
    
  }
  
  function setCarritoVacio() {
    cartRows.innerHTML = `
    <tr>     
        <td colspan="5"><div class="alert alert-warning my-2 text-center">No tienes products en el carrito</div></td>
    </tr>            
    `;
  }
  function vaciarCarrito() {
    localStorage.removeItem("carrito");
  }
  
  function calcularTotal(products) {
    return products.reduce(
      (acum, product) => (acum += product.precio * product.cantidad),
      0
    );
  }
  
  let cartRows = document.querySelector(".cartRows");
  let products = [];
  
  if (localStorage.carrito && localStorage.carrito != "[]") {
    carrito = JSON.parse(localStorage.carrito);
    carrito.forEach((item, index) => {
      fetch(`/api/productos/${item.id}`)
        .then((resp) => resp.json())
   
        .then((product) => {

            console.log(product.data); // la api trae los datos en productos.data.xxxx



          if (product) {
            cartRows.innerHTML += `
              <tr id="row${index}">
                  <th scope="row">${index + 1}</th>
                  <td>${product.data.nombre}</td>
                  <td>$ ${product.data.precio}</td>
                  <td class="text-center">${item.cantidad}</td>
                  <td class="text-center">$ ${parseFloat(
                    product.data.precio * item.cantidad,
                    2
                  ).toFixed(2)}</td>
                  <td><button class="btn btn-danger btn-sm" onclick=removeItem(${index})><i class="fas fa-trash"></i></button></td>
              </tr>            
              `;
            products.push({
              productId: product.data.id,
              nombre: product.data.nombre,
              precio: product.data.precio,
              cantidad: item.cantidad,
            });

            console.log(products);

          } else {
            carrito.splice(index, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
          }
        })
        .then(() => {
          document.querySelector(".totalAmount").innerText = `$ ${calcularTotal(
            products
          )}`;
        });
    });
  } else {
    setCarritoVacio();
  }
  
  let formCheckout = document.querySelector("#checkoutCart"); 

 
  
  formCheckout.onsubmit = (e) => {
    e.preventDefault();
    const formData = {
      orderItems: products,
      //paymentMethod: formCheckout.paymentMethod.value,
      //shippingMethod: formCheckout.shippingMethod.value,
      total: calcularTotal(products),
    };

    vaciarCarrito();  //al comprar vacio el carrito y voy a /
    location.href = `/`;

/*
    // para cargar los datos de la venta en la base de datos
    fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) {
          //borro el carrito
          vaciarCarrito();
          location.href = `/order/${res.order.id}?creado=true`;
        } else {
          alert("No se pudo realizar la compra, intente mas tarde");
        }
      })
      .catch((error) => console.log(error));

      */
     //console.log(formCheckout.elements, formData, products);



  };
  