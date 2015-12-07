var model = require('../models/models.js');


/**
  * Renderiza la vista que muestra el formulario de alta de una nota
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next */
exports.altaNota = function(req,res,next){
    res.render("notas/alta",{errors:[]});
};


/**
  * Alta de un post en la base de datos
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next */
exports.create = function(req,res,next){
    
    var nombre      = req.body.nombre;
    var descripcion = req.body.descripcion;
    var userId      = req.session.user.id;
    
    var post = {
        titulo: nombre,
        descripcion: descripcion,
        UserId: userId
    };
    
    var modelo = model.Post.build(post);
    modelo.save().then(function() {
        console.log("post dado de alta");
        res.redirect("/posts");
        
    }).catch(function(err) {
        console.log("Error al dar de alta un post en BBDD: " + err.message);
        next(err);
    });
  
};


/**
  * Recupera los post dado de alta por un determinado usuario
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next */
exports.getPosts = function(req,res,next){
    var userId = req.session.user.id;
    
    var busqueda = {
        UserId: userId
    };
    
    model.Post.findAll({where:busqueda}).then(function(posts) {
        console.log("Post del usuario " + userId + " recuperados");
        res.render("notas/posts",{posts:posts,errors:[]});
        
    }).catch(function(err) {
        console.log("Error al recuperar los posts del usuario " + userId + ": " + err.message);
        next(err);
    });
  
};