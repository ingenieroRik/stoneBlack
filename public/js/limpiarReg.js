window.addEventListener('DOMContentLoaded', () =>{

    const form = document.querySelector('.limpiar-reg');



//  esto borrará los que hay dentro de los div de errores
const setSuccessFor = (input) => {
    const formControl = input.closest('div');
    formControl.classList.remove('error');
    const errorText = formControl.querySelector('.er-text');
    errorText.innerText = '';
   }; 

// Agrega eventos para borrar las clases de error cuando se completa el input o se presiona Tab
    form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
    // Obtiene el valor del campo y elimina los espacios en blanco al principio y al final
    const value = input.value.trim();
    // Si el campo no está vacío, elimina cualquier mensaje de error
    if (value !== '') {
        setSuccessFor(input);
    }
    });
});



});