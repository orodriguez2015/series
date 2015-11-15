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
        id: categoriaVideoId
    };
    
    model.CategoriaVideoYoutube.find({where:busqueda}).then(function(categoria){
        console.log("autoload categoria vídeo encontrado");
        console.log("autoload Categoria video id: " + categoria.id + ", nombre de la categoria: " + categoria.nombre);
        req.CategoriaVideo = categoria;
        next();
        
    }).catch(function(err){
        console.log("Error en autoload de vídeo " + err.message); 
        next(err);
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
exports.edit = function(req,res,next){
    var categoria = req.CategoriaVideo;
    console.log('Edit categoria ' + categoria.id + ", nombre: " + categoria.nombre);
    
    res.render("videos/editCategoria",{errors:[],categoria:categoria});
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
    
    console.log("request nombre: " + nombre + ", descripcion: " + descripcion);
    console.log('Se procede a editar la categoria de id' + categoria.id + " , nombre " + categoria.nombre + " y descripcion: " + categoria.descripcion);
    
    categoria.nombre      = req.body.nombre;
    categoria.descripcion = req.body.descripcion;
    categoria.UserId      = idUsuario;
    
    categoria.save().then(function(){
        
        console.log("Categoria de vídeo con id " + categoria.id + " editada");
        res.redirect("/videos/categorias");     
        
    }).catch(function(err){
        console.log("Error al actualizar la categoria de id " + categoria.id + " en BD: " + err.message);
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
    model.CategoriaVideoYoutube.findAll({where:busqueda}).then(function(categ){
        
       console.log("Num categorias recuperadas: " + categ.length);
       res.render("videos/categorias",{errors:[],categorias:categ});
        
    }).catch(function(err){
        console.log("Error al recuperar las categorias de vídeos: " + err.message); 
        next(err);
    });
};


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
    
    var categoria = model.CategoriaVideoYoutube.build(parametros);
    categoria.save().then(function(){
        
        console.log("Categoría de vídeo dada de alta");
        res.redirect("/videos/categorias");
        
    }).catch(function(err){
        console.log("Error al dar de alta una categoría de vídeo en BD: " + err.message);
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
        res.redirect("/videos/categorias");
        
    }).catch(function(err){
        console.log("Error al eliminar una determinada categoría de vídeo: " + err.message);
        next(err);
    });
};