var model = require('../models/models.js');

/**
  * Función de autoload que recupera una determinado categoría de vídeos de un de de la tabla VideoYoutube, para
  * almacenar en la request
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.load = function(req,res,next,categoriaVideoId){

    var busqueda = {
        id: categoriaVideoId,
        UserId: req.session.user.id
    };

    model.CategoriaVideoYoutube.find({where:busqueda}).then(function(categoria){
        console.log("autoload Categoria video id: " + categoria.id + ", nombre de la categoria: " + categoria.nombre);
        req.CategoriaVideo = categoria;
        next();

    }).catch(function(err){
        console.log("Error en autoload de vídeo " + err.message);
        next(err);
    });
};


/**
  * Recupera las categorías de vídeos dadas de alta por un determinado usuario, y
  * renderiza la vista
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.getCategorias = function(req,res,next){

    var idUsuario = req.session.user.id;
    var busqueda = {
        UserId: idUsuario
    };

    console.log("Llamada a getCategorias() para recuperar categorías del usuario: " + idUsuario);
    model.CategoriaVideoYoutube.findAll({where:busqueda,include:[{model:model.VideoYoutube}]}).then(function(categ){

       console.log("Num categorias recuperadas: " + categ.length);
       devolverSalida(res,categ);

    }).catch(function(err){
        console.log("Error al recuperar las categorias de vídeos: " + err.message);
        next(err);
    });
};



/**
  * Permite eliminar una determinada categoría de vídeo usuario
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.destroyCategoria = function(req,res,next){
    var categoria = req.CategoriaVideo;

    categoria.destroy().then(function(){
        console.log("Categoría de vídeo eliminada");

        var respuesta = {
            status: 0
        }

        devolverSalida(res,respuesta);

    }).catch(function(err){
        console.log("Error al eliminar una determinada categoría de vídeo: " + err.message);
        res.status(500).send("Error al recuperar los usuarios de la BBDD: " + error.message);
    });
};



/**
  * Devuelve la salida en formato JSON. Es utilizada por la función saveVideo
  * @param res: Objeto de tipo Response
  * @param respuesta: Objeto que contiene la respuesta y que se
  *        convierte a JSON
  */
function devolverSalida(res,respuesta) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(respuesta));
    res.end();
};




/**
  * Alta de una categoría de vídeo de youtube de un determinado usuario
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.saveCategoria = function(req,res,next){

    var idUsuario = req.session.user.id;
    var parametros = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        UserId: idUsuario
    };

    console.log("nombre: " + req.body.nombre + ", descripcion: " + req.body.descripcion);

    var categoria = model.CategoriaVideoYoutube.build(parametros);
    categoria.save().then(function(){

        console.log("Categoría de vídeo dada de alta");
        var resultado = {
          status: 0
        };

        devolverSalida(res,resultado)

    }).catch(function(err){
        console.log("Error al dar de alta una categoría de vídeo en BD: " + err.message);
        res.status(500).send("Error al dar de alta una categoría en BD: " + err.message);
    });
};


/**
  * Función que recupera una determinada categoría, y procede a renderizar la vista
  * de edición de la misma
  * almacenar en la request
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.getCategoria = function(req,res,next){
    var categoria = req.CategoriaVideo;

    devolverSalida(res,categoria);
    //res.render("videos/editCategoria",{errors:[],categoria:categoria});
};



/**
  * Función que actualiza una determinada categoría de vídeo en BD.
  * La categoría a editar ha sido recuperada
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.update = function(req,res,next){

    var nombre      = req.body.nombre;
    var descripcion = req.body.descripcion;
    var idUsuario   = req.session.user.id;
    var categoria   = req.CategoriaVideo;

    console.log('Se procede a editar la categoria de id' + categoria.id + " , nombre " + categoria.nombre + " y descripcion: " + categoria.descripcion);

    categoria.nombre      = req.body.nombre;
    categoria.descripcion = req.body.descripcion;
    categoria.UserId      = idUsuario;

    categoria.save().then(function(){

        var respuesta = {
          status:0
        };

        devolverSalida(res,respuesta);

    }).catch(function(err){
        console.log("Error al actualizar la categoria de id " + categoria.id + " en BD: " + err.message);
        res.status(500).send("Error al actualizar la categoria de id " + categoria.id + ": " +  err.message);
    });

};



/**
  * Recupera las categorías creadas por un determinado usuario
  * @param idUsuario: Id del usuario
  * @param success: Función callback a la que se invoca una vez recuperadas
                    las categorías
  */
exports.getCategoriasUsuario = function(idUsuario,success){

    var busqueda = {
        UserId: idUsuario
    };

    model.CategoriaVideoYoutube.findAll({where:busqueda}).then(function(categorias){

       success(categorias,null);

    }).catch(function(err){
        console.log("getCategoriasUsuario(): Error al recuperar las categorias de vídeos: " + err.message);
        success(null,err);
    });
};


/****************************************************/









/**
  * Renderiza la pantalla de alta de una categoría de vídeos de youtube
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.newCategoria = function(req,res,next){
    res.render("videos/altaCategoria",{errors:[]});
};


/**
  * Comprueba si una determinada categoria tiene asignada algún vídeo
  * @param res: Objeto de tipo response
  * @param req: Objeto de tipo request
  * @param next: Objeto de tipo next
  */
exports.videosConCategoria = function(req,res,next) {
    console.log("videosConCategoria =====>");

    var idCategoria = req.CategoriaVideo.id;
    var busqueda = {
        where: [{CategoriaVideoYoutubeId:idCategoria}]
    };

    model.VideoYoutube.count(busqueda).then(function(num){
        console.log("Hay " + num + " vídeos de la categoria de id " + idCategoria);

        var respuesta = {
            status:0,
            descStatus: ''
        }

        if(num>0) {
            // La categoría tiene vídeos asignados
            respuesta.status = 1;
            respuesta.descStatus = 'No se puede eliminar la categoría puesto que tiene vídeos asignados';

        } else
        if(num==0) {
            respuesta.status=0;
            respuesta.descStatus = 'La categoría no tiene vídeos asignados';
        }

        devolverSalida(res,respuesta);

    }).catch(function(err){
        console.log("Error al contar videos de la categoria de id " + idCategoria + " : " + err.message);
        next(err);
    });
};




exports.getCategoriasUsuarioConVideos = function(idUsuario,success){

    var busqueda = {
        UserId: idUsuario
    };

    model.CategoriaVideoYoutube.findAll({where:busqueda,include:[{model:model.VideoYoutube}]}).then(function(categ){

       success(categ,null);

    }).catch(function(err){
        console.log("getCategoriasUsuario(): Error al recuperar las categorias de vídeos: " + err.message);
        success(null,err);
    });
};
