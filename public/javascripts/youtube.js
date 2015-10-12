function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}

$(function() {
    
    // Se captura el evento onclibk sobre el boton "btnLimpiar"
    $("#btnLimpiar").on("click",function(){
        $("#busqueda").val(""); 
    });
    
    
    
    // Se crea un manejador de eventos para el submit del formulario, de modo que
    // se captura y se invoca al api de youtube para buscar los vídeos 
    $("form").on("submit", function(e) { 
       e.preventDefault();
      $("#results").html("");
       // prepare the request
       var request = gapi.client.youtube.search.list({
            part: "snippet",
            chart: "mostPopular",
            type: "video",
            q: encodeURIComponent($("#busqueda").val()).replace(/%20/g, "+"),
            maxResults: 25,
            order: "viewCount",
            regionCode:"es",
            publishedAfter: "2015-01-01T00:00:00Z"
       }); 
       // execute the request
       request.execute(function(response) {
          var results = response.result;
          
          $.each(results.items, function(index, item) {
            $.get("/tpl/videoThumbnail.html", function(data) {  
                $("#results").append(tplawesome(data, [{"title":item.snippet.title, "videoid":item.id.videoId,"defaultImage":item.snippet.thumbnails.high.url,"channelTitle": item.snippet.channelTitle           
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

function init() { 
    gapi.client.setApiKey("AIzaSyCY9xryyOVZkhySj6xRygDGzSegW8acbAY");
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
        console.log("El API de Youtube está lista");
    });
}
