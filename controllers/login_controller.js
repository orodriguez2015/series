var model = require('../models/models.js');

/**
  * Función que se invoca para renderizar la pantalla de login
  * @req: Objeto request
  * @res: Objeto response
  * @next: Objeto next 
  */
exports.login = function(req,res,next){
    console.log("Cargando la pantalla de login");
    res.render("login/login",{errors:[],error:undefined});
};



/**
  * Función que se invoca autenticar a un usuario. Recibe la contraseña
  * y el login, y comprueba si se trata de un usuario que está en la base de datos.
  * Si el usuario existe, se almacena un objeto en la sesión, en el parámetro user
  * @req: Objeto request
  * @res: Objeto response
  * @next: Objeto next 
  */
exports.autenticate = function(req,res,next){
    var login    = req.body.login;
    var password = req.body.password;
    
    console.log(" Autenticando al usuario de login: " + login);
    
    model.User.find({where: {login:login,password:password}}).then(function(user){
        
        if(user!=undefined){
            console.log("Usuario autenticado id: " + user.id + ",login " + user.login);
            // Se almacena un objeto con el id y login del usuario en la sesión
            
            var nombreCompleto = user.nombre + " " + user.apellido1;
            var usuario = {id:user.id,login:user.login,nombre:nombreCompleto};
            req.session.user = usuario;
            // Se redirige al path desde el que se ha realizado la sesión
            res.redirect(req.session.path);
            
        }else {
            console.log("No existe el usuario");
            var error = new Error('No existe el usuario en el sistema');
            
            res.render("login/login",{errors:[],error:error});
        }
        
    }).catch(function(err){
        console.log("Error al autenticar al usuario con login " + login + ": " + err.message);  
    });
};


/**
  * Función que se invoca para cerrar la sesión de un usuario
  * @req: Objeto request
  * @res: Objeto response
  * @next: Objeto next 
  */
exports.destroy = function(req,res,next){
    var usuario = req.session.user;
    if(usuario!=undefined) {
        console.log("Cerrando la sesión del usuario");
        // Se elimina el atributo user de la request
        delete req.session.user;
    }
    // Se redirige a la url desde la que se ha hecho la petición de logout
    res.redirect(req.session.path.toString());
};


exports.loginRequired = function(req,res,next) { 
    if(req.session.user!=undefined) {
        // Si existe el objeto user en la sesión, el usuario ya se ha autenticado.
        // Se redirige la petición al siguiente middleware
        next();   
    } else {
        // Si el usuario no está autenticado, se redirige hacia la pantalla de login
        res.redirect("/login");
    }
    
};