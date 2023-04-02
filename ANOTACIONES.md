1- Ver a donde redirigimos las paginas despues de CREAR y EDITAR productos.
2- Estaria bueno agregar un titulo para saber quien esta iniciado sesion.
3- modif  2023-14-01 00:34
4- 2023-17-01 se simplificaron rutas (se llevo a 4 rutas), se hicieron controladores (index, user y products). En login hay 3 niveles: usuario, administrador y supervisor. Para loguearse como supervisor hay que poner supervisor@supervisor y la clave es supervisor
2023-29-01  se coloco condicional para que no aparezca venrana de login luego de logearse, se encripto generacion y logeo de administrador, se modifica ventana emergente de registro de usuario y admistrador enviando mensajes y mostrando datos de registro.
 2023-31-1 se agrego cookie para recordar usuario.
 2023-04-02  se bloquean rutas que son de uso del administrador y supervisor exclusivamente.
 2023-07-02 se completo validaciones del formulario de devolucion de producto con middleware de ruta (devolverMiddleware).