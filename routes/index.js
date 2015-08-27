var express = require('express');
var router = express.Router();

var usersController = require('../controllers/user_controller.js');
var categoriaController = require('../controllers/categoria_controller.js');


// Autoload para la carga de un usuario en la request
router.param('userId',usersController.load);

// Autoload para la carga de un categoria en la request
router.param('categoriaId',categoriaController.load);

// GET /users/new. Carga el formulario de alta de un nuevo usuario
router.get('/users/new',usersController.new);

// POST /users/create. Da de alta un usuario en la base de datos, siempre y cuando no exista
router.post('/users/create',usersController.create);

// GET /users. Renderiza el listado con las tablas de usuarios
router.get('/users',usersController.users);

// DELETE /users/:userId/. Elimina un determinado usuario de la base de datos
router.delete("/users/:userId(\\d+)",usersController.delete);

// GET /users/:userId/. Edita un determinado usuario de la base de datos
router.get("/users/:userId(\\d+)",usersController.show);

// POST /users/existsUser. Esta petición comprueba si un login y un email ya está asignado a un 
// usuario del sistema
router.post("/users/existsUser",usersController.exists);

// POST /users/existeLoginEmailOtroUsuario. Esta petición comprueba si existe otro usuario
// distinto a uno determinado, que tenga un determinado login o email
router.post("/users/existeLoginEmailOtroUsuario",usersController.existeLoginEmailOtroUsuario);

//  POST /users/edit . Esta petición actualiza los datos de un determinado usuario en el sistema
router.post("/users/edit/:userId(\\d+)",usersController.update);

// GET /categorias/new. Petición del formulario de renderizado de la pantalla de alta de una nueva categoría
router.get("/categorias/new",categoriaController.new);

// POST /categorias/create. Petición del formulario de alta de una nueva categoría en la base de datos
router.post("/categorias/create",categoriaController.create);

// GET /categorias. Petición del formulario para renderizar la vista con el listado de categorías
router.get("/categorias",categoriaController.show);


router.get("/categorias/:categoriaId(\\d+)",categoriaController.edit);
// GET /. Página de entrada en el sistema
router.get('/',function(req,res){
	res.render('index',{errors:[]});
});



module.exports = router;


