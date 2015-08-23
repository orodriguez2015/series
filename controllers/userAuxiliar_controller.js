var model = require('../models/models.js');

/**
  * Función llamada para comprobar si existe un usuario
  * con un determinado login en la base de datos
  * @param login: Login del usuario
  * @param callback: Funcion callback 
  */ 
exports.existeLogin = function(login,callback) { 

	model.User.find({
      where: ["login=?",login]

    }).then(function(user) {
    	console.log("userAuxiliar_controller existe el usuario con login");
    	// Existe un usuario con el login 
    	callback(null,user);

    }).catch(function(err) { 

    	console.log("Error al comprobar si existe un usuario con el login " + login + ": " + err.message);
    	callback(err,null);
    });
};



/**
  * Función llamada para comprobar si existe un usuario
  * con un determinado email en la base de datos
  * @param email: Email del usuario
  * @param callback: Funcion callback 
  */ 
exports.existeEmail = function(email,callback) { 

	model.User.find({
      where: ["email=?",email]

    }).then(function(user) {
    	// Existe un usuario con el login 
    	console.log("userAuxiliar_controller existe el usuario con email");
    	callback(null,user);
    	
    }).catch(function(err) { 

    	console.log("Error al comprobar si existe un usuario con el email " + email + ": " + err.message);
    	callback(err,null);
    });
};



/**
  * Función que comprueba si existe en la BD un usuario con un login o email y que no sea
  * el usuario cuyo id se pasa en el parámetro idUsuario
  * @param login: Login a comprobar
  * @param email: Email a comprobar
  * @param idUsuario: Id del usuario
  * @param callback: Función callback que se invoca para devolver un resultado, que será el usuario
  * o error que se ha producido al ejecutar la función 
  */
exports.existeOtroUsuarioConLoginEmail = function(login,email,idUsuario,callback) {
    
  // Se importa sequelize
  var Sequelize = require('sequelize');
    
    /** original */
  var condition = {
    where: Sequelize.and(
    { 
        id: {ne:idUsuario } 
    },
    Sequelize.or(
      {
       email: { eq: email},
       login: { eq: login }
      }
    )
  )
}; 

    

    model.User.findAll(condition).then(function(user){
        
      console.log("Se ha encontrado un usuario con el login o email indicado y no es el usuario actual");  
      callback(user,null);    
        
    }).catch(function(err){
        
        console.log("Error al comprobar la existencia de un usuario con login o email que no sea el usuario de id " + idUsuario + ": " + err.message);
        
      callback(null,err);   
    }); 
    
};