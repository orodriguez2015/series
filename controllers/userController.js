
var model = require('../models/models.js');
var aux = require('./userAuxiliar_controller.js');

/**
  * Función que carga el formulario de alta de un nuevo 
  * usuario
  * @param: req: Objeto request
  * @param: res: Objeto response
  */
exports.new = function(req,res){

  console.log("Renderizado del formulario de alta de un nuevo formulario");
	res.render('users/new',{errors:[]});

};


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
exports.users = function(req,res,next){

  console.log("Renderizado del listado de usuarios del sistema");

  model.User.findAll({order:[['nombre', 'ASC'],['apellido1','ASC'],['apellido2', 'ASC']]}).then(function(users) { 
    console.log("Listado de usuarios recuperados");
    res.render('users/show',{users:users,errors:[]});  

  }).catch(function(error) { 
    console.log("Error al recuperar el listado de usuarios: " + error.message);
    next(err);
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
    res.redirect("/users");

  }).catch(function(error) { 
    console.log("Error al eliminar el usuario de id " + req.User.id + ": " + error.message);
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
  * Función que renderiza la vista que permite editar un usuario del sistema
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.show = function(req,res,next){

  console.log("user_controller.show() ========>");

  var user = req.User;
  console.log("Se va a editar el usuario con id: " + user.id);
  console.log("Se va a editar el usuario con nombre: " + user.nombre);
  console.log("Se va a editar el usuario con apellido1: " + user.apellido1);

  res.render("users/edit",{usuario:req.User,errors:{}});
};




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
  */
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
    
};