
            const checkoutButton = document.getElementById("checkout-payment");

            
            //se modifica para que al presionar pagar no se comunique con mercadopago
            function graciasPagar() {alert("gracias por pagar con Mercado Pago")};

           /* 
      // para pagar con mercado pago ver https://www.youtube.com/watch?v=QqiDandkcBY
      
            checkoutButton.addEventListener("click", async () => {
              const respuesta = await fetch(`/create-order/${checkoutButton.value}`, {
               
                method: "POST",
                headers: {"Content-Type": "application/json",
                 },
              });
              const data = await respuesta.json();
         
              window.location.href = data.init_point;
            });
            */