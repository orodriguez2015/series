var model = require('../models/models.js');

/**
  * Renderiza la vista que muestra el formulario de alta de serie
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next */
exports.create = function(req,res,next){
    
    console.log("Carga de la pantalla con el formulario de alta de una nueva serie");
    
    model.Categoria.findAll({order:[['nombre', 'ASC']]}).then(function(categorias){
        console.log("Se han recuperado las categorias, se proceder a renderizar la vista");
        res.render("series/new",{categorias:categorias,errors:[]});    
        
    }).catch(function(err){
        console.log("Error al recuperar las categorías: " + err.message);
        next(err);
    });
};


/**
  * Función de autoload de un capítulo de una serie
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next 
  */
exports.load = function(req,res,next,capituloId){
    
    console.log("Se procede a realizar el autoload del capitulo " + capituloId);
    
    // Al recuperar una serie, se recuperará también
    model.CapituloSerie.find({where: {id:capituloId}}).then(function(capitulo){
        req.CapituloSerie = capitulo;
        next();
        
    }).catch(function(err){
        console.log("Error al realizar el autoload del capitulo " + capituloId + ": "  + err.message);
        next(err);
    });
    
};



/**
  * Función que permite eliminar un determinado capítulo de una serie
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param next: Objeto next
  */
exports.delete = function(req,res,next){
    
    console.log("Serie a eliminar: " + req.CapituloSerie.id);
    var capitulo = req.CapituloSerie;
    
    capitulo.destroy().then(function(){
        console.log("Capitulo " + req.CapituloSerie.id + " eliminada");
        res.redirect("/series/capitulos/" + req.CapituloSerie.SerieId);
    }).catch(function(err){
        console.log("Error al eliminar el capítulo " + req.CapituloSerie.id + ": " + err.message);
        next(err);
    });
    
};
