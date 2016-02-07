
var model = require('../models/models.js');
var aux = require('./userAuxiliar_controller.js');



/********************* NUEVO *************************/


/**
  * Función de autoload para cargar un usuario en la request.
  * También sirve para realizar un control de errores
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  * @param userId: Identificador del usuario
  */
exports.load = function(req,res,next,userId) {

  console.log('user_controller.load() cargando el usuario de id ' + userId)
  model.User.find({
      where: {id: Number(userId)}

    }).then(function (user) { 
      console.log('user_controller.load() cargando el usuario de nombre ' + user.nombre);
      req.User = user;
      next();
    }).catch(function(err){
      next(err);
    });

};


/**
  * Función que comprueba si ya existe algún usuario en la base de datos, con un 
  * determinado login o email
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.exists = function(req,res,next){

  console.log("user_controller.exists() ========>");

  var email = req.body.email;
  var login = req.body.login;
    
    console.log("email: " + email + ", login: " + login);

  var salida = {
      status: -1,
      login: false,
      email: false
  };


  if(email!=undefined && email!='' && login!=undefined && login!='') {
    
    var continuar = true;
    aux.existeLogin(login,function(err,user){
      console.log("Verificando login");
      if(err) {
        // Error técnico al comprobar la existencia de un usuario
        // con el login
        salida.status = -1;
        console.log("Verificando login: Error técnico: " + err.message);
      }else
      if(user) {
        // si existe el usuario con el login
        salida.status = 0;
        salida.login = true;
        console.log("Verificando login: Existe usuario con login " + login);

      } else {
        salida.status = 0;
        salida.login = false;
        console.log("Verificando login: No existe usuario con login " + login);
      }


      if(salida.status==0) {
        // Sino existe error al verificar al login del usuario, se procede
        // a comprobar la existencia de un usuario con un email determinado 
        aux.existeEmail(email,function(err,user) { 
          console.log("Verificando email")
          if(err) {
            console.log("Verificando email. Error tecnico: " + err.message);
            salida.status = -2;

          }else {

            if(user){
              console.log("Verificando email. Existe usuario con el email")
              // Existe un usuario en la BD con el email
              salida.email = true;
            } else { 
              console.log("Verificando email. No existe usuario con el email");
              salida.email  = false;
            }

          }// else

          res.writeHead(200, {"Content-Type": "application/json"});
          res.write(JSON.stringify(salida));
          res.end();

        });
      } else { 
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(salida));
        res.end();
      }

    });
  }
};



/**
  * Da de alta un usuario en la base de datos
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.create = function(req,res,next) {

    var login = req.body.login;
    var password = req.body.password;
    var nombre = req.body.nombre;
    var apellido1 = req.body.apellido1;
    var apellido2 = req.body.apellido2;
    var email = req.body.email;

    console.log("login: " + login + ",password: " + password + ",nombre: " + nombre
    + ",apellido1: " + apellido1 +  ",apellido2 " + apellido2 + ", email: " + email);
    
    var encriptar = require('../utilidades/encriptacion.js');
    var passMd5 = encriptar.encriptarPassword(password);
    
    // Se crea el objeto User que todavía no se trata de un objeto persistente
    var user = model.User.build({
      login: login,
      password: passMd5,
      nombre:nombre,
      apellido1: apellido1,
      apellido2: apellido2,
      email: email
    });
    
    
    // Se procede a dar de alta
    user.save().then(function(){
        var respuesta = {
            status: 0
        };
        console.log("Usuario dado de alta");
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(respuesta));
        res.end();

    }).catch(function(error) { 
        var respuesta = {
            status: 1
        };
        console.log("Se ha producido un error durante el alta del usuario: " + error.message);
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(respuesta));
        res.end();
    });    
};



/**
  * Función que carga el listado de usuarios
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.getUsers = function(req,res,next){

  model.User.findAll({order:[['nombre', 'ASC'],['apellido1','ASC'],['apellido2', 'ASC']]}).then(function(users) { 
    
      res.writeHead(200, {"Content-Type": "application/json"});
      res.write(JSON.stringify(users));
      res.end();  
    
  }).catch(function(error) { 
      console.log("Error al recuperar el listado de usuarios: " + error.message);  
      res.status(500).send("Error al recuperar los usuarios de la BBDD: " + error.message);
  });
};



/**
  * Función que elimina un determinado usuario de la base de datos
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.delete = function(req,res,next){

  console.log("user_controller.delete() ========>");

  var user = req.User;
  console.log("Se va a eliminar el usuario con nombre: " + user.nombre);

  req.User.destroy().then(function(users) { 
      console.log("Usuario eliminado");
      var respuesta = {
          status: 0
      };
      
      res.writeHead(200, {"Content-Type": "application/json"});
      res.write(JSON.stringify(respuesta));
      res.end();  

  }).catch(function(error) { 
      console.log("Error al eliminar el usuario de id " + req.User.id + ": " + error.message);
      res.status(500).send("Error al eliminar el usuario de id " + req.User.id + ": " + error.message);
    
  });
};



/**
  * Devuelve en formato JSON un determinado usuario que ya ha sido recuperado
  * en el autoload, a través de la función load
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.getUser = function(req,res,next){
  var user = req.User;
    
  res.writeHead(200, {"Content-Type": "application/json"});
  res.write(JSON.stringify(user));
  res.end();  
  
};




/**
  * Función que es invocada a la hora de actualizar un usuario en la BBDD
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.update = function(req,res,next) {
    // Se recupera el usuario cargado previamente en la función load de autoload
    var user = req.User;
    
    var id        = req.body.id;
    var login     = req.body.login;
    var password  = req.body.password;
    var nombre    = req.body.nombre;
    var apellido1 = req.body.apellido1;
    var apellido2 = req.body.apellido2;
    var email     = req.body.email;
    
    
    console.log("id: " + id + ",login: " + login + ",pasword: " + password + ",nombre: " + nombre + ",apellido1: " + apellido1 + ",apellido2: " + apellido2 + ",email: " + email);
    
    // Se obtiene el hash SHA1 de la password, de modo que se almacenará en base de datos
    var encriptar = require('../utilidades/encriptacion.js');
    var passMd5 = encriptar.encriptarPassword(password);
    
    console.log("********* El usuario de la sesión : " + user.id);
    user.login = login;
    user.password = passMd5;
    user.nombre = nombre;
    user.apellido1 = apellido1;
    user.apellido2 = apellido2;
    user.email = email;
    
    
    user.save().then(function(){
        
        var respuesta = {
            status: 0
        };
        
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(respuesta));
        res.end();  
        
    }).catch(function(err){
        console.log("Error al actualizar los datos del usuario en la base de datos: " + req.User.id + ": " + error.message);
        res.status(500).send("Error al actualizar los datos del usuario de id " + req.User.id + ": " + error.message);
    });
    
};



/*****************************************************/




/**
  * Función que comprueba si ya existe algún usuario en la base de datos con un login o email, siempre
  * y cuando no sean de un usuario con un determinado id
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.existeLoginEmailOtroUsuario = function(req,res,next){

  console.log("user_controller.existeLoginEmailOtroUsuario() ========>");

  var email = req.body.email;
  var login = req.body.login;
  var idUsuario = req.body.id;
    
  var salida = {
      status: -2
  };

  console.log("email " + email + ", login: " + login + ", idUsuario: " + idUsuario);
  if(email!=undefined && email!='' && login!=undefined && login!='' && idUsuario!=undefined && idUsuario!='')   {
      console.log("Comprobar existencia otro usuario con login e email");
      aux.existeOtroUsuarioConLoginEmail(login,email,idUsuario,function(salida,err){

        if(salida){
            console.log("salida.status: " + salida.status);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(JSON.stringify(salida));
            res.end();  
            
        }
        else  
        if(err) { 
          console.log("Se ha producido un error al realizar la consulta: " + err.message);   
        }
        
          
          
          
        
          
     });
  
  }//if
  else console.log("Parámetros incorrectos"); 
};


/**
  * POST /users/edit . Función que atiende la petición de edición de un determimado usuario del sistema
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  *
exports.update = function(req,res,next) {
    // Se recupera el usuario cargado previamente en la función load de autoload
    var user = req.User;
    
    var id = req.body.id;
    var login = req.body.login;
    var password = req.body.password;
    var nombre = req.body.nombre;
    var apellido1 = req.body.apellido1;
    var apellido2 = req.body.apellido2;
    var email = req.body.email;
    
    
    console.log("id: " + id + ",login: " + login + ",pasword: " + password + ",nombre: " + nombre + ",apellido1: " + apellido1 + ",apellido2: " + apellido2 + ",email: " + email);
    
    // Se obtiene el hash SHA1 de la password, de modo que se almacenará en base de datos
    var encriptar = require('../utilidades/encriptacion.js');
    var passMd5 = encriptar.encriptarPassword(password);
    
    console.log("********* El usuario de la sesión : " + user.id);
    user.login = login;
    user.password = passMd5;
    user.nombre = nombre;
    user.apellido1 = apellido1;
    user.apellido2 = apellido2;
    user.email = email;
    
    
    user.save().then(function(){
        console.log("Usuario con id "  + id + " actualizado");
        res.redirect("/users");
        
    }).catch(function(err){
        console.log("========> ERROR AL ACTUALIZAR UN USUARIO: " + err.message); 
        next(err);
    });
    
}; */