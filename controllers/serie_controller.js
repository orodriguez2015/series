var model = require('../models/models.js');

/**
  * Renderiza la vista que muestra el formulario de alta de serie
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next */
exports.new = function(req,res,next){
    
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
  * Función que da de alta una erie en la base de datos
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next */
exports.create = function(req,res,next){
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var categoria = req.body.categoria;
    
    console.log("Se procede a dar de alta la serie de nombre: " + nombre);
    
    var serie = model.Serie.build({nombre:nombre,descripcion:descripcion,categoria:categoria});
    
    serie.save().then(function(){
        console.log("Serie almacenada en base de datos"); 
        res.redirect("/series");    
        
    }).catch(function(err){
        console.log("Error al almacenar la serie en base de datos: " + err.message);
        next(err);
    });
    
};




/**
  * Obtiene un listado de la series existentes en la base de datos
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next 
  */
exports.show = function(req,res,next){
    
    console.log("Se procede a renderizar la vista con el listado de series existentes");
    
    model.Serie.findAll({order:[['nombre', 'ASC']]}).then(function(series){
        console.log("Serie almacenada en base de datos"); 
        res.render("series/show",{series:series,errors:[]});    
        
    }).catch(function(err){
        console.log("Error al almacenar la serie en base de datos: " + err.message);
        next(err);
    });
    
};