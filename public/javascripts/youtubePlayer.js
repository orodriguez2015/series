/**********************************************************/
/***** CONTIENE LAS FUNCIONES NECESARIAS PARA CARGAR  *****/
/***** EL API JS DEL REPRODUCTOR DE YOUTUBE Y CARGAR, *****/
/*****         PARAR Y REPRODUCIR UN VÍDEO            *****/  
/**********************************************************/

var player; // Reproductor del Vídeo de Youtube

    /**
      * Función llamada por el API del reproductor de youtube, cuando dicho
      * reproductor haya sido cargado. En esta función de inicializar el reproductor 
      * de youtube 
      */
    function onYouTubePlayerAPIReady() { 
        try{
            // Se oculta el div que contiene 
            ocultarReproductorYoutube();
            player = new YT.Player('ytplayer'); 
            
        }catch(Err) { 
            alert("Error al cargar Youtube Player: " + Err.message);   
        }
    } 
    

    /**
      * Función que es invocada para mostrar un determinado vídeo en Youtube
      * @param videoId: Id del video
      */
    function mostrarVideo(videoId) { 
        try { 
            // Se muestra el div que contiene el reproductor de vídeos de Youtube
            mostrarReproductorYoutube();
            player.loadVideoById({videoId:videoId,
                    playerVars: {'rel': 0,'autoplay':1, 'loop':0, 'controls':0, 'showinfo':0, 'modestbranding':1, 'border':0, 'title':'', 'showinfo':0,'wmode':'transparent','suggestedQuality':'hd720'}
                });
            
        }catch(Err) { 
            alert("Se ha producido un error al mostrar el vídeo: " + Err.message);
        }   
     }
    
    

    /**
      * Reproduce el vídeo de youtube
      */
    function playVideo() { 
        if(player!=undefined) player.playVideo();
    }


    /**
      * Para la reprodución del vídeo de youtube
      */
    function stopVideo() { 
        if(player!=undefined) { 
            player.stopVideo();
            player.clearVideo();
        } 
    }


    function mostrarReproductorYoutube() { 
        $('#ytplayer').show();
    }


    function ocultarReproductorYoutube() { 
        stopVideo(); // Se para el vídeo
        $('#ytplayer').hide(); // Se oculta el div en el que se muestra el reproductor
    }

    /**
      * Manejador de eventos onclick para el body. Se comprueba si el div con el reproductor está
      * visible, y en ese caso se oculta */
    $("body").on("click",function() { 
        
        // Si el div que contiene el reproductor de vídeos de youtube está visible, y 
        // el reproductor está definido
        if( $('#ytplayer').is(":visible") && player!=undefined){
            // Se comprueba el estado de la reproducción. Si es alguno de esos estados, 
            // entonces se oculta el reproductor porque se ha hecho click con el ratón
            // fuera de área de reproducción del vídeo.
            var estado = player.getPlayerState();
            if(estado==0 || estado==1 || estado==2 || estado==3 || estado==5) {
                ocultarReproductorYoutube();
            }
    
            
        }
        
    });



    $(document).bind('keydown',function(e){
        if (e.which == 27){
            console.log("Has pulsado la tecla ESC");
        };
    });
