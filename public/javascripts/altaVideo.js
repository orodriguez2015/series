function saveVideo(idVideo,idCanal,tituloVideo,descripcionVideo,urlImagen) { 
    try { 

        var parametros = {
            videoId : idVideo,
            canalId : idCanal,
            titulo:tituloVideo,
            descripcion:descripcionVideo,
            urlImagen:urlImagen
        }

        var parametros = "videoId=" + idVideo + "&canalId=" + idCanal + "&titulo=" + tituloVideo + 
            "&descripcion=" + descripcionVideo + "&urlImagen=" + urlImagen;


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
    alert(data.descStatus);
}

function procesarError() { 
    alert("error")
}