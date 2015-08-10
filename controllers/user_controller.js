var model = require('../models/models.js');

/**
  * Función que carga el formulario de alta de un nuevo 
  * usuario
  * @param: req: Objeto request
  * @param: res: Objeto response
  */
exports.new = function(req,res){

  console.log("Renderizado del formulario de alta de un nuevo formulario");
	res.render('users/new');

};


/**
  * Función que carga el formulario de alta de un nuevo 
  * usuario
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.create = function(req,res,next){

    console.log("/POST /users/create ====>");

    var login = req.body.login;
    var password = req.body.password;
    var nombre = req.body.nombre;
    var apellido1 = req.body.apellido1;
    var apellido2 = req.body.apellido2;
    var email = req.body.email;

    console.log("login: " + login + ",password: " + password + ",nombre: " + nombre
    + ",apellido1: " + apellido1 +  ",apellido2 " + apellido2 + ", email: " + email);

    // Se crea el objeto User que todavía no se trata de un objeto persistente
    var user = model.User.build({
      login: login,
      password: password,
      nombre:nombre,
      apellido1: apellido1,
      apellido2: apellido2,
      email: email
    });

    user.save().then(function(){
        console.log("Usuario dado de alta");

    }).catch(function(error) { 
        console.log("Se ha producido un error durante el alta del usuario: " + error.message);
        next(error);
    });

	

};