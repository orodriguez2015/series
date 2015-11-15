function saveVideo(idVideo,idCanal,descCanal,tituloVideo,descripcionVideo,urlImagen) { 
    try { 
        var parametros = "videoId=" + idVideo + "&canalId=" + idCanal + "&titulo=" + tituloVideo + 
            "&descripcion=" + descripcionVideo + "&urlImagen=" + urlImagen + "&descCanal=" + escape(descCanal);

        $.ajax({
            url: "/videos/create",
            type: "POST",
            async: true,
            data: parametros,    
            success: procesarRespuesta,
            error: procesarError
        });
        
    }catch(err) { 
        alert("Error: " + err.message);
    }   
        
}// saveVideo
    
    
function procesarRespuesta(data) { 
    // Se muestra el mensaje de exito devuelve por el servidor
    alert(data.descStatus);
}

function procesarError(data) { 
    // Se muestra el mensaje de error devuelto por el servidor
    alert(data.descStatus);   
}