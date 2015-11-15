var model = require('../models/models.js');

/**
  * Función que renderiza la página de búsqueda de vídeos en youtube
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.show = function(req,res,next) { 
    console.log('mostrando videos');
    res.render("videos/search",{errors:[]});
};



/**
  * Función de autoload que recupera un determinado vídeo de la tabla VideoYoutube, para 
  * almacenar en la request
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.load = function(req,res,next,videoId){
    
    var busqueda = {
        id: videoId
    };
    
    model.VideoYoutube.find({where:busqueda}).then(function(video){
        console.log("autoload video encontrado");
        console.log("id video recuperado: " + video.id + ",nombre: " + video.nombre);
        req.Video = video;
        next();
        
    }).catch(function(err){
        console.log("Error en autoload de vídeo " + err.message); 
        next(err);
    });
};




/**
  * Función que permite dar de alta un determinado vídeo en la tabla VideoYoutube
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.saveVideo = function(req,res,next) { 
    
    var idVideo     = req.body.videoId; // Id vídeo
    var idCanal     = req.body.canalId; // Id canal
    var descCanal   = req.body.descCanal; // Descripción del canal
    var titulo      = req.body.titulo;   // Título
    var descripcion = req.body.descripcion; // Descripción
    var urlImagen   = req.body.urlImagen;  // Url imagen vídeo
    var idUsuario   = req.session.user.id;  // Id usuario
    
    
    var respuesta = {
        status: 0,
        descStatus: "OK"
    };
    
    console.log("idVideo: " + idVideo + ",idCanal " + idCanal + ",titulo: " + titulo +
               ",descripcion: " + descripcion + ",urlImagen: " + urlImagen + ",idUsuario: " + idUsuario);
    
    // Se devolverá un JSON
    res.writeHead(200, { 'Content-Type': 'application/json' }); 
    
    // Se comprueba primero si el vídeo ya está insertado en base de datos
    var busqueda = {
        idVideo: idVideo,
        idCanal: idCanal
    };
    
    model.VideoYoutube.findAll({where: busqueda}).then(function(videos) {
    
        if(videos!=undefined && videos.length>0) { 
            console.log("Existe el vídeo en base de datos")
            // Se devuelve error, puesto que ya está el vídeo dado de alta
            respuesta.status = 1;
            respuesta.descStatus = "El vídeo ya está dado de alta en la base de datos";
            devolverSalida(res,respuesta);
        } else {
            // Se procede a comprobar a dar de alta el vídeo en base de datos

            /*********************************/
             var objVideo = {
                idVideo: idVideo,
                idCanal: idCanal,
                    descCanal: descCanal,
                tituloVideo: titulo,
                descripcionVideo: descripcion,
                urlImagen: urlImagen,
                UserId: idUsuario
            };
    
            var video = model.VideoYoutube.build(objVideo);

            // Se almacena el vídeo en base de datos
            video.save().then(function() { 
                
                console.log("Vídeo grabado en base de datos");
                
                respuesta.status = 0;
                respuesta.descStatus = "El vídeo ha sido grabado como favorito";
                devolverSalida(res,respuesta);

            }).catch(function(err){
                console.log("Error al dar de alta un vídeo de youtube en BD: " + err.message); 
                respuesta.status = 3;
                respuesta.descStatus = "Error al dar de alta un vídeo de youtube en BD: " + err.message;
                devolverSalida(res,respuesta);
            });
            
            /*********************************/
        }  
           
    }).catch(function(err){
        console.log("Se ha producido un error al comprobar si el vídeo ya existe en la BD: " + err.message);
        respuesta.status = 2;
        respuesta.descStatus = "Se ha producido un error al comprobar si el vídeo ya existe en la BD: " +       err.message;
        
        devolverSalida(res,respuesta);
    });
   
    
};



/**
  * Recupera los vídeos almacenados por un determinado usuario y renderiza la vista
  * @param res: Objeto de tipo response
  * @param req: Objeto de tipo request
  * @param next: Objeto de tipo next 
  */
exports.getVideosAlmacenados = function(req,res,next) {
    console.log("getVideosAlmacenados =====>");
    var idUsuario   = req.session.user.id; 
    
    console.log("idUsuario: " + idUsuario);
    
    // Se recupera los vídeos almacenados por el usuario que está logueado
    var busqueda = {
       UserId:  idUsuario
    };
    
    model.VideoYoutube.findAll({where: busqueda}).then(function(videos) {
        res.render("videos/videosFavoritosUsuario",{errors:[],videos:videos});
        
    }).catch(function(err) { 
        console.log("Error al recuperar videos almacenados del usuario " + req.session.user.id + ": " + err.message);
        next(err);
    });

};




/**
  * Elimina un determinado vídeo de youtube almacenado en la tabla VideoYoutube
  * @param res: Objeto de tipo response
  * @param req: Objeto de tipo request
  * @param next: Objeto de tipo next 
  */
exports.destroyVideo = function(req,res,next) {
    
    console.log("destroyVideo =====>");
    
    var video = req.Video; // Se recupera el vídeo cargado en el autoload
    
    video.destroy().then(function() {
        console.log("Video " + video.idVideo + " eliminado");
        // Se redirige a la pantalla de los vídeos de usuario para recargarla
        res.redirect("/videos/usuario");
        
    }).catch(function(err) { 
        console.log("Error al eliminar el vídeo " + video.idVideo + ": " + err.message);
        next(err);
    });

};


/**
  * Devuelve la salida en formato JSON. Es utilizada por la función saveVideo
  * @param res: Objeto de tipo Response
  * @param respuesta: Objeto que contiene la respuesta y que se 
  *        convierte a JSON
  */
function devolverSalida(res,respuesta) { 
    res.write(JSON.stringify(respuesta));
    res.end(); 
}