
            const checkoutButton = document.getElementById("checkout-payment");
      
            checkoutButton.addEventListener("click", async () => {
              const respuesta = await fetch(`/create-order/${checkoutButton.value}`, {
               
                method: "POST",
                headers: {"Content-Type": "application/json",
                 },
              });
              const data = await respuesta.json();
         
              window.location.href = data.init_point;
            });
