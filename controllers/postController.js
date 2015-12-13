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

    var titulo      = req.body.titulo;
    var descripcion = req.body.descripcion;
    var userId      = req.session.user.id;

    
    console.log("postController.create titulo: "  + titulo + ",descripcion: " + descripcion);
    console.log("postController.create userId: "  + userId);
    
    var post = {
        titulo: titulo,
        descripcion: descripcion,
        UserId: userId
    };
    
    var modelo = model.Post.build(post);
    modelo.save().then(function() {
        console.log("post dado de alta");
        
        var salida = {
            status:0
        };
        
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(salida));
        res.end();

    }).catch(function(err) {
        console.log("Error al dar de alta un post en BBDD: " + err.message);
        var salida = {
            status:1
        };
        
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(salida));
        res.end();
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
    
    model.Post.findAll({where:busqueda,order:[['createdAt','DESC']]}).then(function(posts) {
        console.log("Post del usuario " + userId + " recuperados");
        res.render("notas/posts",{posts:posts,errors:[]});
        
    }).catch(function(err) {
        console.log("Error al recuperar los posts del usuario " + userId + ": " + err.message);
        next(err);
    });
  
};


/**
  * Elimina un determinado post de la base de datos
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next */
exports.deletePost = function(req,res,next){
    var userId = req.session.user.id;
    
    var post = req.Post;
    
    post.destroy().then(function() {
        var salida = {
            status: 0
        }
        
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(salida));
        res.end();
        
    }).catch(function(err) {
        console.log("Error al eliminar un post de la BD: " + userId + ": " + err.message);
        var salida = {
            status: 1
        }
        
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(salida));
        res.end();
    });
  
};


/**
  * Función de autoload que recupera un determinado post de la base de datos
  * y lo carga en la request
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  * @param postId: Id del post a recuperar
  */
exports.load = function(req,res,next,postId){
    
    var busqueda = {
        id: postId
    };
    
    model.Post.find({where:busqueda}).then(function(post){
        req.Post = post;
        next();
        
    }).catch(function(err){
        console.log("Error en autoload de post " + err.message); 
        next(err);
    });
};
