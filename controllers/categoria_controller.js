var model = require('../models/models.js');


/**
  * Función que carga el formulario de alta de una categoría
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.new = function(req,res,next){

  console.log("Renderizado del formulario de alta de una nueva categoría");
  res.render('categorias/new',{errors:[]});

};


/**
  * Función de autoload de una categoría
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.load = function(req,res,next,categoriaId){
  console.log("Función de autoload de categoria " + categoriaId);

  model.Categoria.find({where: {id:categoriaId}}.then(function(categoria){
      if(categoria){
          console.log("Se ha recuperado la categoria de id: " + categoriaId);
          req.Categoria = categoria;
          next();
      }
  }).catch(function(err){
      console.log("Error al recuperar la categoria en la función de autoload: " + err.message);
      next(err);
  });
    
};


/**
  * Función que permite dar de alta una nueva categoría en la base de dato
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.create = function(req,res,next){
  console.log("Se procede a dar de alta una categoria en BD");
    
  var nombre = req.body.nombre;

  var categoria = model.Categoria.build({
    nombre: nombre
  });
  
  // Se procede a almacenar en base de datos la categoría    
  categoria.save().then(function(){
      console.log("Categoría almacenada en base de datos");
      res.redirect("/categorias");
      
      
  }).catch(function(err){
      console.log("Error al almacenar la categoría en base de datos");
      next(err);
  });
};



/**
  * Función que permite recuperar las categorías que hay en la base de datos
  * para mostrar un listado de las mismas
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.show = function(req,res,next){
  console.log("Se procede a renderizar el listado de categorias");
    
  // Se procede a almacenar en base de datos la categoría    
  model.Categoria.findAll({order:[['nombre','ASC']]}).then(function(categorias){
      if(categorias){
        res.render("categorias/show",{categorias:categorias,errors:{}});        
      }
      
      console.log("Categoría almacenada en base de datos");
      
  }).catch(function(err){
      console.log("Error al recuperar el listado de categorias: " + err.message);
      next(err);
  });
};