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

    var idUsuario = req.session.user.id;
    var inicio    = req.params.inicio;
    var fin       = req.params.fin;

    var consulta;

    // Si se envían los datos de paginación, los criterios de búsqueda son distintos
    // al caso de que no se envíen
    if(inicio!=undefined && fin!=undefined && inicio!='' && fin!='') {
      consulta = {
        where: {UserId: idUsuario},
        offset: inicio,
        limit: fin,
        order: [['titulo','ASC']]
      };

    } else {
        consulta = {
          where: {UserId: idUsuario},
          order: [['titulo','ASC']]
        };
    }



    model.Pelicula.findAll(consulta).then(function(peliculas) {
      // Ahora que se han recuperado las películas, se procede
      // a obtener el número total de películas
          model.Pelicula.count({where:{UserId:idUsuario}}).then(function(total) {

                // Se devuelve las películas en formato JSON
                var resultado = {
                  total : total,
                  peliculas: peliculas
                }
                salida.devolverJSON(res,resultado);

          }).catch(function(err) {

              console.log("Error al recuperar el número de películas del usuario con id " + idUsuario + ": " + err.description);
              res.status(500).send("Error al recuperar el número de películas del usuario con id " + idUsuario + ": " + err.message);

          });


    }).catch(function(err) {
        console.log("Error al recuperar las películas del usuario con id " + idUsuario + ": " + err.message);
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
      puntuacion: (puntuacion!='')?puntuacion:0,
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




/**
  * Elimina una determinada un película de la base de datos
  * @param res: Objeto de tipo response
  * @param req: Objeto de tipo request
  * @param next: Objeto de tipo next
  */
exports.get = function(req,res,next) {
    // Se recupera la película de la request, ya que ha sido
    // cargada en el método load
    var modelo = req.Pelicula;

    // Se devuelve la película en formato JSON
    salida.devolverJSON(res,modelo);
};



/**
  * Actualiza una película en base de datos
  * @param res: Objeto de tipo response
  * @param req: Objeto de tipo request
  * @param next: Objeto de tipo next
  */
exports.update = function(req,res,next) {
    var pelicula    = req.Pelicula;
    var titulo      = req.body.titulo;
    var descripcion = req.body.descripcion;
    var visto       = req.body.visto;
    var puntuacion  = req.body.puntuacion;

    pelicula.titulo = titulo;
    pelicula.descripcion = descripcion;
    pelicula.visto = visto;
    pelicula.puntuacion = puntuacion;

    // Se procede a almacenar la película en BBDD
    pelicula.save().then(function(){

      var resultado = {
        status :0
      };

      // Se devuelve las películas en formato JSON
      salida.devolverJSON(res,resultado);

    }).catch(function(err){
      console.log("Se ha producido un error al editar la película en BD: " + err.message);
      res.status(500).send("Se ha producido un error al editar la película en BD: " + err.message);
    });

};
