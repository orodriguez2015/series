function PostFacade() {
   
};


/**
  * Alta de un post a través de una petición AJAX enviada por POST
  * @param url: URL del servidor al que se realiza el envio
  * @param datos: Objeto con los datos del post/noticia a dar de alta en la BD
  * @param success: Función de éxito que se invoca en caso de éxito
  * @param error: Función de error que se invoca en caso de error
  */
PostFacade.prototype.createPost = function(url,datos,success,error) {
    
    $.ajax({                 
         url: url,
         type: "POST",
         dataType: "application/json",
         data: datos,
         cache: false,
         async: false
        
     }).complete( function (data) {
        
    
        if(data!=undefined && data.readyState==4) {
            
            var respuesta = JSON.parse(data.responseText);
            if(respuesta.status==0) {
                success("Se ha dado de alta la noticia en base de datos");     
            } else 
                error("Se ha producido un error al dar de alta la noticia en base de datos");
        } else 
            error("No se puede establecer conexión con el servidor");
     });   
};


/**
  * Alta de un post a través de una petición AJAX enviada por POST
  * @param url: URL del servidor al que se realiza el envio
  * @param datos: Objeto con los datos del post/noticia a dar de alta en la BD
  * @param success: Función de éxito que se invoca en caso de éxito
  * @param error: Función de error que se invoca en caso de error
  */
PostFacade.prototype.deletePost = function(url,datos,success,error) {
    
    $.ajax({                 
         url: url,
         type: "POST",
         dataType: "application/json",
         data: datos,
         cache: false,
         async: false
        
     }).complete( function (data) {
        
    
        if(data!=undefined && data.readyState==4) {
            console.log("responseTxt: " + data.responseText);
            try {
                var respuesta = JSON.parse(data.responseText);
                if(respuesta.status==0) {
                    success("OPERACION CORRECTA. Se ha borrado la noticia");     
                } else 
                    error("ERROR. Se ha producido un error al eliminar la noticia");
            }catch(err) {
                error("ERROR. Se ha producido un error técnico");
            }
        } else 
            error("ERROR. No se puede establecer conexión con el servidor");
     });   
};