var model = require('../models/models.js');


/**
  * Alta de un post en la base de datos
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next */
exports.create = function(req,res,next){

    var titulo      = req.body.titulo;
    var descripcion = req.body.descripcion;
    var userId      = req.session.user.id;
    
    var post = {
        titulo: titulo,
        descripcion: descripcion,
        UserId: userId
    };
    
    var modelo = model.Post.build(post);
    modelo.save().then(function() {
     
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
  * @param req: Objeto next 
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
  
}; */


/**
  * Recupera los post dado de alta por un determinado usuario. Devuelve los datos
  * en un JSON
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next */
exports.getPosts = function(req,res,next){
    var userId = req.session.user.id;
    var inicio = req.params.inicio;
    var fin    = req.params.fin;
    
    console.log("getPost2 userId: " + userId + ", inicio: " + inicio + ", fin: " + fin);
        
    var consulta = {
        where: {UserId:userId},
        offset: inicio,
        limit: fin,
        order: [['createdAt','DESC']]
    }

    model.Post.findAll(consulta).then(function(posts) {
        
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(posts));
        res.end();
        
    }).catch(function(err) {
        var msg = "Error al recuperar los posts del usuario " + userId + ": " + err.message;
        
        var salida = {
            status: 1,
             descStatus: msg,
            datos: posts
        }
        
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(salida));
        res.end();
    });
  
};



/**
  * Recupera el número total de posts existentes en la base de datos, y 
  * que hayan sido dados de alta por un determinado usuario
  * @param req: Objeto Request
  * @param res: Objeto Response
  * @param req: Objeto next 
  */
exports.getNumTotalPosts = function(req,res,next){
    var userId = req.session.user.id;
    console.log("getNumTotalPosts userId: " + userId);
    
    var parteWhere = {
        UserId: userId
    };
    
    var consulta = {
        where: parteWhere
    }
    
    model.Post.count(consulta).then(function(num) {    
        
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.write(JSON.stringify(num));
        res.end();
        
    }).catch(function(err) {
       console.err("Error al recuperar el número total de posts del usuario " + userId + ": " + err.message);
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
