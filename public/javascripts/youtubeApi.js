/**
  * Función que tiene que existir y que es invocada por el API de google al cargarse,
  * concretamente carga el API V3 de Youtube
  */
function init() { 
    gapi.client.setApiKey("AIzaSyCY9xryyOVZkhySj6xRygDGzSegW8acbAY");
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
        console.log("El API de Youtube está lista");
    });
}


function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}

$(function() {
    
    // Se captura el evento onclibk sobre el boton "btnLimpiar"
    $("#btnLimpiar").on("click",function(){
        $("#busqueda").val(""); 
        $("#results").html("");
        // Se oculta la capa del vídeo de youtube y se para la reproduccción
        ocultarReproductorYoutube(); 
    });
    
    
    
    // Se crea un manejador de eventos para el submit del formulario, de modo que
    // se captura y se invoca al api de youtube para buscar los vídeos 
    $("form").on("submit", function(e) { 
       e.preventDefault();
        
       // Se oculta la capa del vídeo de youtube y se para la reproduccción
       ocultarReproductorYoutube(); 
        
      $("#results").html("");
       // Se hace uso del api de youtube para buscar la lista de vídeos   
        /*
       var request = gapi.client.youtube.search.list({
            part: "snippet",
            chart: "mostPopular",
            type: "video",
            q: encodeURIComponent($("#busqueda").val()).replace(/%20/g, "+"),
            maxResults: $('#numero').val(),
            order: "viewCount",
            regionCode:"es",
            publishedAfter: "2015-01-01T00:00:00Z"
       }); 
       */
        
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            chart: "mostPopular",
            type: "video",
            q: encodeURIComponent($("#busqueda").val()).replace(/%20/g, "+"),
            maxResults: $('#numero').val(),
            order: "viewCount",
            regionCode:"es"
       }); 
        
        
       /* así funciona sin indicar el código de región ni el chart, maxResults, order
            var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: "mnpAYcm8090"
       }); */
       
        
       // Se llama al método execute para procesar la respuesta devuelta por el API de youtube
       request.execute(function(response) {
           
          var results = response.result;
          
          $.each(results.items, function(index, item) {
            $.get("/tpl/videoThumbnail.html", function(data) {  
                $("#results").append(tplawesome(data, [{"title":item.snippet.title, "videoid":item.id.videoId,"defaultImage":item.snippet.thumbnails.high.url,"channelTitle": escape(item.snippet.channelTitle),
"descripcionVideo": escape(item.snippet.description),"idCanal": item.snippet.channelId
}]));
            }); 
          });
          resetVideoHeight();
       });
    });
    
    $(window).on("resize", resetVideoHeight);
});


function resetVideoHeight() {
    $(".video").css("height", $("#results").width() * 9/16);
}




