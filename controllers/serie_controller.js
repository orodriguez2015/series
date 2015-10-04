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
    
    if(req.session.user!=undefined) { 
        // Se obtiene el id del usuario logueado que se encuentra en la sesión
        var idUsuario = req.session.user.id;


        // Al recuperar una serie, se recuperará también sus temporadas     
        // Se recupera una serie, y para esta serie sus temporadas, y su vez, por cada temporada,
        // sus capítulos
        model.Serie.find({where: {id:serieId},include:[{model:model.Temporada,include:[{model:model.CapituloSerie}]}]}).then(function(serie){   

            var usuarioVisualizaController = require('./usuarioVisualizaSerie_controller.js');
            // Se ha recuperado la serie, con sus temporadas, y por cada temporada, sus capítulos.
            if(serie!=undefined && serie.temporadas!=undefined) { 

                var temporadas = serie.temporadas;

                for(var i=0;i<temporadas.length;i++) {

                    console.log("Temporada " + temporadas[i].id + " tiene capitulos: " + temporadas[i].capituloSerieses.length);

                    var capitulos = serie.temporadas[i].capituloSerieses;
                    for(var j=0;j<capitulos.length;j++) { 
                        var idCapitulo = capitulos[j].id;
                        console.log("capitulos bucle " + idCapitulo + ",idUsuario: " + idUsuario);       


                        /*
                        usuarioVisualizaController.comprobarUsuarioVisualizadoCapitulo(idUsuario,idCapitulo,
                        function (err,existe,capitulos[j]) {

                            var oCapitulo = capitulos[j];
                            console.log("capitulos[j].id: " + capitulos[j].id);
                            console.log("oCapitulo.id: " + oCapitulo.id);

                            Object.defineProperties(oCapitulo, {
                                "getVisto": { get: function () { return this.visto; } },
                                "setVisto": { set: function (x) { this.visto = x; } }
                            });



                            if(err) { 
                                console.log("serie_controller.load(): " + err.message);   
                            }else {

                                if(existe) { 
                                    console.log("visto");
                                } 

                            }




                        }); */

                    }// for
                }// for


            }


            req.Serie = serie;        
            console.log("Serie recuperada y almacenada en la request"); 
            next();

        }).catch(function(err){
            console.log("Error al realizar el autoload de una serie: " + err.message);
            next(err);
        });
    } else // Sino existe el objeto user en la sesión, se redirige a la pantalla de login
        res.redirect("/login");
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
    
    var serie = model.Serie.build({nombre:nombre,descripcion:descripcion,CategoriaId:categoria,idUsuario:req.session.user.id});
    
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
  var idTemporada = req.body.temporada;
    
  console.log("Alta de capítulo de nombre: " + capitulo);
  console.log("Alta de capítulo de url: " + url);
  console.log("idTemporada: " + idTemporada);
    
  // Se crea el objeto CapituloSerie que tiene una categoría asociada 
  var capituloSerie = model.CapituloSerie.build({
    nombre: capitulo,
    url: url,
    puntuacion: puntuacion,
    TemporadaId: idTemporada,
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



/**
  * Función que renderiza la vista de alta de una temporada de una serie
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param next: Objeto Next
  */
exports.newTemporada = function(req,res,next) { 
    console.log("Renderizado de la vista de la serie " + req.id + ",nombre: " + req.nombre);
    
    //where: {id:serieId}
    model.Temporada.findAll({where:{SerieId:req.Serie.id},order:[['nombre', 'ASC']]}).then(function(temporadas){
        res.render('series/temporada',{serie:req.Serie,temporadas:temporadas,errors:[]});   
        
    }).catch(function(err){
        console.log("Error al recuperar las temporadas actuales " + err.message);
        next(err); 
    });
 
};



/**
  * Función que permite dar de alta una temporada
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param next: Objeto Next
  */
exports.createTemporada = function(req,res,next) { 
    var serie = req.Serie;
    
    var nombre = req.body.nombre;
    
    console.log("nombre temporada: " + nombre);
    var temporada = model.Temporada.build({nombre:nombre,SerieId:serie.id   });
    temporada.save().then(function(){
        
        console.log("Temporada dada de alta");
        res.redirect('/series/temporada/' + serie.id);
        
    }).catch(function(err){
        console.log("Error al dar de alta la temporada " + err.message);
        next(err);
    });  
};