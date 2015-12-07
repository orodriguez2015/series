/**
  * Alta de un post a través de una petición AJAX enviada por POST
  * @param url: URL del servidor al que se realiza el envio
  * @param successAction: Función de éxito que se invoca en caso de éxito
  * @param errorAction: Función de error que se invoca en caso de error
  */
function createPost(url,datos,successAction,errorAction) {

    $.ajax({                 
         url: url,
         type: "POST",
         dataType: "text/html",
         data: "?titulo=" + datos.titulo + "&descripcion=" + datos.descripcion,
         cache: false,
         contentType: false,
         processData: false,
         async: false
     }).complete( function (data) {

         if (data !== undefined && data !== null && data.statusText === 'OK' && data.status==200) {        

                 if (data.responseText) {                                  
                     var respuesta = JSON.parse(data.responseText);
                     var statusUpload = respuesta.statusUpload;

                   

                     

                     

             } else {

                     errorAction(Inditex.i18n.msg('constants.err.uploadFileItxServer'));

             }

        } else {

                errorAction(Inditex.i18n.msg('constants.msgErr.uploadFile'));                

        }

     });        

        

};
    
    
};