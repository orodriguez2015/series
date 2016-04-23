var model = require('../models/models.js');
var salida = require("./salidaUtil.js");


/**
  * Función de autoload que recupera una determinada película de la tabla pelicula, para
  * almacenar en la request
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  * @param peliculaId: Id de la película
  */
exports.load = function(req,res,next,peliculaId){

    var busqueda = {
        id: peliculaId
    };


    model.Pelicula.find({where:busqueda}).then(function(pelicula){
        console.log("autoload película encontrado");
        req.Pelicula = pelicula;
        next();

    }).catch(function(err){
        console.log("Error en autoload de película: " + err.message);
        next(err);
    });
};



/**
  * Recupera las películas de un determinado usuario
  * @param res: Objeto de tipo response
  * @param req: Objeto de tipo request
  * @param next: Objeto de tipo next
  */
exports.getPeliculas = function(req,res,next) {
    var idUsuario   = req.session.user.id;
    var busqueda = {
      UserId: idUsuario
    };

    model.Pelicula.findAll({where:busqueda}).then(function(peliculas) {
      // Se devuelve las películas en formato JSON
      salida.devolverJSON(res,peliculas);

    }).catch(function(err) {
        console.log("Error al recuperar las películas del usuario con id " + idUsuario + ": " + err.message);
        console.log("Error al recuperar las películas del usuario con id " + idUsuario + ": " + err.description);
        res.status(500).send("Error al recuperar las películas del usuario con id " + idUsuario + ": " + err.message);

    });
};



/**
  * Graba un película de un usuario en la base de datos
  * @param res: Objeto de tipo response
  * @param req: Objeto de tipo request
  * @param next: Objeto de tipo next
  */
exports.save = function(req,res,next) {
    var idUsuario   = req.session.user.id;
    var titulo      = req.body.titulo;
    var descripcion = req.body.descripcion;
    var visto       = req.body.visto;
    var puntuacion  = req.body.puntuacion;

    var pelicula = {
      titulo: titulo,
      descripcion: descripcion,
      visto: visto,
      puntuacion: puntuacion,
      UserId: idUsuario
    };

    var modelo = model.Pelicula.build(pelicula);

    // Se procede a almacenar la película en BBDD
    modelo.save().then(function(){

      var resultado = {
        status :0
      };

      // Se devuelve las películas en formato JSON
      salida.devolverJSON(res,resultado);

    }).catch(function(err){
      console.log("Se ha producido un error al grabar la película en BD: " + err.message);
      res.status(500).send("Se ha producido un error al grabar la película en BD: " + err.message);
    });

};




/**
  * Elimina una determinada un película de la base de datos
  * @param res: Objeto de tipo response
  * @param req: Objeto de tipo request
  * @param next: Objeto de tipo next
  */
exports.delete = function(req,res,next) {
    // Se recupera la película de la request, ya que ha sido
    // cargada en el método load
    var modelo = req.Pelicula;

    // Se procede a eliminar la película en BBDD
    modelo.destroy().then(function(){

      var resultado = {
        status :0
      };

      // Se devuelve las películas en formato JSON
      salida.devolverJSON(res,resultado);

    }).catch(function(err){
      console.log("Se ha producido un error al eliminar la película en BD: " + err.message);
      res.status(500).send("Se ha producido un error al eliminar la película en BD: " + err.message);
    });

};
