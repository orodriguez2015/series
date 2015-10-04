var model = require('../models/models.js');

/**
  * Función llamada para dar de alta un registro en la tabla UsuarioVisualizaSeries
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */ 
exports.altaUsuarioVisualizaSerie = function(req,res,next) { 
    
    var idUsuario  = req.session.user.id;
    var idCapitulo = req.params.idCapitulo;
    var idSerie = req.params.idSerie;
    
    var objeto = model.UsuarioVisualizaSerie.build({CapituloSerieId:idCapitulo, UserId:idUsuario});
    
	objeto.save().then(function() {
      res.redirect("/series/capitulos/" + idSerie);

    }).catch(function(err) { 
    	console.log("Error al almacenar un registro en la tabla UsuarioVisualizaSerie: " + err.message);
    	next(err);
    }); 
};



/**
  * Función que comprueba si un determinado usuario del sistema, ha visualiza un 
  * determinado capítulo de una serie
  * @param idUsuario: Id del usuario
  * @param idCapitulo: Id del capítulo
  * @param salida: Funcion callback a través de la cual se devuelve la salida o el error que
  * se haya producido al realizar la comprobación
  */ 
exports.comprobarUsuarioVisualizadoCapitulo = function(idUsuario,idCapitulo,capitulo,salida) { 
    
    var condicion = {
        where: {
                CapituloSerieId: { eq: idCapitulo},
                UserId: { eq: idUsuario }
        }
    };
    
    model.UsuarioVisualizaSerie.findAll(condicion).then(function(dato){
        console.log("El usuario " + idUsuario + " ha visualizado el capítulo " + idCapitulo);
        salida(null,true,capitulo);
        
    }).catch(function(err) { 
    	console.log("Error al comproba si el usuario " + idUsuario + " ha visualizado el capítulo " + idCapitulo + ": " + err.message);
    	salida(err,false,capitulo);
        
    }); 
};


