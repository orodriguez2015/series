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
  * Obtiene un listado de la series existentes en la base de datos
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next 
  */
exports.load = function(req,res,next,serieId){
    
    console.log("Se procede a realizar el autoload de la serie");
    
    // Al recuperar una serie, se recuperará también
    model.Serie.find({where: {id:serieId},include:[{model:model.CapituloSerie}]}).then(function(serie){
        req.Serie = serie;        
        console.log("Serie recuperada y almacenada en la request"); 
        next();
        
    }).catch(function(err){
        console.log("Error al realizar el autoload de una serie: " + err.message);
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
    console.log("Se procede a dar de alta la serie de descripcion: " + descripcion);
    console.log("Se procede a dar de alta la serie de categoria: " + categoria);
    
    var serie = model.Serie.build({nombre:nombre,descripcion:descripcion,CategoriaId:categoria});
    
    serie.save().then(function(){
        console.log("Serie almacenada en base de datos"); 
        res.redirect("/series");    
        
    }).catch(function(err){
        console.log("Error al almacenar la serie en base de datos: " + err.message);
        next(err);
    });
    
};




/**
  * Obtiene un listado de la series existentes en la base de datos ordenadas alfabéticamente
  * por el nombre
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next 
  */
exports.show = function(req,res,next){
    
    console.log("Se procede a renderizar la vista con el listado de series existentes");

    // Al recuperar todas las series, por cada una de ellas, se recupera la categoria asociada, cuyo nombre
    // es Categoria, tal y como se ha definido en el models.js . Para recuperar la categoria para cada serie, 
    // basta con ejecutar series[i].categorium
    model.Serie.findAll({order:[['nombre', 'ASC']],
                         include: [{model:model.Categoria,as:'Categoria'}]
                        }).then(function(series){    
        console.log("Se recupera todas las series ordenadas por nombre"); 
        res.render("series/show",{series:series,errors:[]});    
        
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
exports.destroy = function(req,res,next){
    
    var serie = req.Serie;
    console.log("Se procede a eliminar la serie de id " + serie.id);
    
    serie.destroy().then(function(){
        console.log("Serie de id " + serie.id + " eliminada de base de datos"); 
        res.redirect("/series"); 
        
    }).catch(function(err){
        console.log("Error al eliminar la serie de base de datos: " + err.message);
        next(err);
    });
    
};




/**
  * Recupera una determinada serie y renderiza la vista que permite su edición
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next 
  */
exports.edit = function(req,res,next){
    // La serie junto con su categoría ya se ha recuperado en el autoload
    var serie = req.Serie;
    console.log("Se procede a renderizar la vista de edición de la serie de id " + serie.id);
    
    // Se recuperan las categorías para generar el contenido de la lista desplegable
    model.Categoria.findAll({order:[['nombre', 'ASC']]}).then(function(categorias){
        console.log("Se han recuperado las categorias, se proceder a renderizar la vista");
        res.render("series/edit",{serie:serie,categorias:categorias,errors:[]});
        
    }).catch(function(err){
        console.log("Error al recuperar las categorías para editar la serie de id " + serie.id + " : " + err.message);
        next(err);
    });
    
};


/**
  * Función que actualiza el contenido de una determinada serie en base de datos
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next 
  */
exports.update = function(req,res,next){
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var categoria = req.body.categoria;
    
    console.log("Se procede a actualizar la serie de nombre: " + nombre);
    console.log("Se procede a actualizar la serie de descripcion: " + descripcion);
    console.log("Se procede a actualizar la serie de categoria: " + categoria);
    
    var serie = req.Serie;
    serie.nombre = nombre;
    serie.descripcion = descripcion;
    serie.CategoriaId = categoria;
    
    serie.save().then(function(){
        console.log("Serie almacenada en base de datos"); 
        res.redirect("/series");    
        
    }).catch(function(err){
        console.log("Error al almacenar la serie en base de datos: " + err.message);
        next(err);
    });    
};



/**
  * Obtiene un listado de la capitulos de una determinada serie, y renderiza la vista
  * por el nombre
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next 
  */
exports.getCapitulos = function(req,res,next){
    // Se recupera la serie de la request, cargada por la función load
    console.log("Se procede a renderizar la vista con el listado de series existentes");
    
    res.render('series/capituloSerie',{serie:req.Serie,errors:[]});
};



exports.createCapitulo = function(req,res,next) { 
  var capitulo = req.body.capitulo;
  var url = req.body.url;
  var puntuacion = req.body.puntuacion;    
    
  console.log("Alta de capítulo de nombre: " + capitulo);
  console.log("Alta de capítulo de url: " + url);
  console.log("Alta de capítulo de puntuacion: " + puntuacion);
  console.log("serie.id : " + req.Serie.id);

    
  // Se crea el objeto CapituloSerie que se va a grabar en base de datos    
  var capituloSerie = model.CapituloSerie.build({
    nombre: capitulo,
    url: url,
    puntuacion: puntuacion,
    SerieId: req.Serie.id,
    idUsuario: req.session.user.id
  });
    

  capituloSerie.save().then(function(){
      // Se ha grabado el capítulo de la serie
      console.log("Almacenado capítulo de la serie " + req.Serie.id + " en base de datos");
      // Se redirige a la vista que muestra los capítulos de una serie
      res.redirect("/series/capitulos/" + req.Serie.id);    
  }).catch(function(err){
      console.log("Error al almacenar capítulo de la serie " + req.Serie.id + " en base de datos: " + err.message);
      next(err);
  });
    
};







