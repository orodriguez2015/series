var express = require('express');
var router = express.Router();

var usersController = require('../controllers/user_controller.js');
var categoriaController = require('../controllers/categoria_controller.js');
var serieController = require('../controllers/serie_controller.js');
var loginController = require('../controllers/login_controller.js');
var capituloSerieController = require('../controllers/capituloSerie_controller.js');
var usuarioVisualizaSerieController = require('../controllers/usuarioVisualizaSerie_controller.js');
var videoController = require('../controllers/videoController.js');


// Autoload para la carga de un usuario en la request
router.param('userId',usersController.load);

// Autoload para la carga de un categoria en la request
router.param('categoriaId',categoriaController.load);

// Autoload para la carga de una serie en la request
router.param('serieId',serieController.load);

// Autoload para la carga de un capitulo de una serie en la request
router.param('capituloId',capituloSerieController.load);

// Autoload para la carga de un vídeo de youtube en la request
router.param('videoId',videoController.load);

// GET /users/new. Carga el formulario de alta de un nuevo usuario
router.get('/users/new',loginController.loginRequired,usersController.new);

// POST /users/create. Da de alta un usuario en la base de datos, siempre y cuando no exista
router.post('/users/create',loginController.loginRequired,usersController.create);

// GET /users. Renderiza el listado con las tablas de usuarios
router.get('/users',loginController.loginRequired,usersController.users);

// DELETE /users/:userId/. Elimina un determinado usuario de la base de datos
router.delete("/users/:userId(\\d+)",loginController.loginRequired,usersController.delete);

// GET /users/:userId/. Edita un determinado usuario de la base de datos
router.get("/users/:userId(\\d+)",loginController.loginRequired,usersController.show);

// POST /users/existsUser. Esta petición comprueba si un login y un email ya está asignado a un 
// usuario del sistema
router.post("/users/existsUser",usersController.exists);

// POST /users/existeLoginEmailOtroUsuario. Esta petición comprueba si existe otro usuario
// distinto a uno determinado, que tenga un determinado login o email
router.post("/users/existeLoginEmailOtroUsuario",usersController.existeLoginEmailOtroUsuario);

//  POST /users/edit . Esta petición actualiza los datos de un determinado usuario en el sistema
router.post("/users/edit/:userId(\\d+)",loginController.loginRequired,usersController.update);

// GET /categorias/new. Petición del formulario de renderizado de la pantalla de alta de una nueva categoría
router.get("/categorias/new",loginController.loginRequired,categoriaController.new);

// POST /categorias/create. Petición del formulario de alta de una nueva categoría en la base de datos
router.post("/categorias/create",categoriaController.create);

// GET /categorias. Petición del formulario para renderizar la vista con el listado de categorías
router.get("/categorias",categoriaController.show);

// GET /categorias/:categoriaId. Recupera una categoría y se renderiza la vista en la que se permite
// modificarla
router.get("/categorias/:categoriaId(\\d+)",loginController.loginRequired,categoriaController.edit);

// POST /categorias/:categoriaId. Permite modificar la descripción de una determinada categoría
router.post("/categorias/:categoriaId(\\d+)",loginController.loginRequired,categoriaController.update);

// DELETE /categorias/:categoriaId. Permite eliminar una determinada categoría
router.delete("/categorias/:categoriaId(\\d+)",loginController.loginRequired,categoriaController.destroy);


// GET /series/new. Petición de carga del formulario de alta de una nueva serie
router.get("/series/new",loginController.loginRequired,serieController.new);

// POST /series. Petición de alta de una nueva serie en la base de datos
router.post("/series",loginController.loginRequired,serieController.create);

// GET /series. Petición para mostrar un listado de las series existentes en la BBDD
router.get("/series",serieController.show);

// DELETE /series. Petición para mostrar un listado de las series existentes en la BBDD
router.delete("/series/:serieId(\\d+)",loginController.loginRequired,serieController.destroy);

// GET /series. Petición para recuperar una determinada serie para renderizar la vista
router.get("/series/:serieId(\\d+)",loginController.loginRequired,serieController.edit);

// POST /series. Petición para actualizar una determinada serie en base de datos
router.post("/series/update/:serieId(\\d+)",loginController.loginRequired,serieController.update);

// GET /series/capitulos/:serieId. Petición para mostrar la serie y su lista de capítulos
router.get("/series/capitulos/:serieId(\\d+)",loginController.loginRequired,serieController.getCapitulos);

// POST /series/capitulos/:serieId. Petición para dar de alta un capítulo asociado a una serie de TV
router.post("/series/capitulos/:serieId(\\d+)",loginController.loginRequired,serieController.createCapitulo);

// DELETE /capitulo/:capituloId. Petición de borrado de un determinado capítlo de una serie
router.delete("/capitulo/:capituloId(\\d+)",loginController.loginRequired,capituloSerieController.delete);

// GET /series/temporada . Petición de carga de la pantalla de alta de temporadas de una serie
router.get("/series/temporada/:serieId(\\d+)",serieController.newTemporada);

// POST /series/temporada. Petición de carga de la pantalla de alta de temporadas de una serie
router.post("/series/temporada/:serieId(\\d+)",serieController.createTemporada);


router.post("/capitulos/visualizacion/:idSerie(\\d+)/:idCapitulo(\\d+)",usuarioVisualizaSerieController.altaUsuarioVisualizaSerie);


// GET /videos. Carga la lista de vídeos. Es necesario estar logueado en la aplicación
router.get("/videos",loginController.loginRequired,videoController.show);

// POST /videos. Permite dar de alta la información de un vídeo determinado en base de datos
router.post("/videos/create",loginController.loginRequired,videoController.saveVideo);

// GET /videos/usuario. Recupera los vídeos almacenados por el usuario
router.get("/videos/usuario",loginController.loginRequired,videoController.getVideosAlmacenados);

// DELETE /videos/:videoId . Permite eliminar un determinado vídeo
router.delete("/videos/:videoId(\\d+)",loginController.loginRequired,videoController.destroyVideo);

// GET /login. Petición de login
router.get("/login",loginController.login);

// POST /login. Petición de autenticación de un usuario
router.post("/login",loginController.autenticate);

// GET /logout. Petición de cierre de sesión de un usuario del sistema
router.get("/logout",loginController.destroy);



// GET /. Página de entrada en el sistema
router.get('/',function(req,res){
	res.render('index',{errors:[]});
});


module.exports = router;