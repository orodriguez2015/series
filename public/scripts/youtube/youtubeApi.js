function init() { 
    gapi.client.setApiKey("AIzaSyCY9xryyOVZkhySj6xRygDGzSegW8acbAY");
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
        console.log("El API de Youtube está lista");
    });
}   

/*
init = function() {

       
      loadApi = function() {
            return new Promise(function(resolve,reject){
                    gapi.client.setApiKey('AIzaSyCY9xryyOVZkhySj6xRygDGzSegW8acbAY');
                    gapi.client.load('youtube', 'v3', resolve);
            });
      };

       
      console.log("tipo loadApi: " + typeof(loadApi));
      for(p in loadApi) {
          console.log("propiedad: " + p);
      }
       
      loadApi.then(function() {
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            chart: "mostPopular",
            type: "video",
            q: encodeURIComponent(dato).replace(/%20/g, "+"),
            maxResults: numero,
            order: "viewCount",
            regionCode:"es"
        });

        request.execute(function(response) {
            var str = JSON.stringify(response.result);
            alert(str);
            return response.result;
        });

      });
    };
*/