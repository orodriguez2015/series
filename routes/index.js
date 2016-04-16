var express = require('express');
var router = express.Router();

var usersController         = require('../controllers/userController.js');
var categoriaController     = require('../controllers/categoria_controller.js');
var serieController         = require('../controllers/serie_controller.js');
var loginController         = require('../controllers/loginController.js');
var capituloSerieController = require('../controllers/capituloSerie_controller.js');
var usuarioVisualizaSerieController = require('../controllers/usuarioVisualizaSerie_controller.js');
var videoController          = require('../controllers/videoController.js');
var categoriaVideoController = require('../controllers/categoriaVideoController.js');
var postController           = require('../controllers/postController.js');
var uploadController         = require('../controllers/uploadFileController.js');
var peliculasController      = require('../controllers/peliculasController.js');


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

// Autoload para la carga de un post en la request
router.param('postId',postController.load);

// Autoload para la carga de un vídeo de youtube en la request
router.param('categoriaVideoId',categoriaVideoController.load);

// Autoload para la carga de una películaen la request
router.param('peliculaId',peliculasController.load);


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

// DELETE /videos/:videoId . Permite eliminar un determinado video
router.delete("/videos/:videoId(\\d+)",loginController.loginRequired,videoController.destroyVideo);




// GET /videos/categorias/alta. Carga la pantalla de alta de una nueva categoria para poder asignar
// a los vídeos de youtube
router.get("/videos/categorias/alta",loginController.loginRequired,categoriaVideoController.newCategoria);


// POST /videos/categorias/comprobarExistenciaVideos/:categoriaVideoId. Petición para comprobar si
// existen vídeos asignados a una determinada categoría.
// @return: Se devuelve un JSON respuesta.status = 0 => La categoría no tiene vídeos
//                              respuesta.status = 1 => La categoría tiene vídeos asignados
 router.post("/videos/categorias/comprobarExistenciaVideos/:categoriaVideoId(\\d+)",loginController.loginRequired,categoriaVideoController.videosConCategoria);

// POST /videos/categorias/asignacionesVideos. Asignación de una misma categoría a varios vídeos
router.post("/videos/categorias/asignacionesVideos",loginController.loginRequired,videoController.asignarVideosCategoria);

// POST /videos/categorias/anular/:categoriaVideoId. Retira la categoría de un determinado vídeo
router.post("/videos/categorias/anular/:videoId(\\d+)",loginController.loginRequired,videoController.eliminarCategoriaVideo);


/********************************************************************************/
/*************** BEGIN: API RESTFULL PARA LA GESTIÓN DE VIDEOS   ****************/
/********************************************************************************/

// POST /videos. Graba un vídeo como favorito de un usuario
router.post("/videos",loginController.loginRequired,videoController.saveVideo);

// GET /videos/categorias . Carga la pantalla que muestra las categorias de vídeos de youtube
// de un determinado usuario
router.get("/videos/categorias",loginController.loginRequired,categoriaVideoController.getCategorias);


// POST /videos/categoria. Permite dar de alta una nueva categoría de vídeos de un usuario
router.post("/videos/categorias",loginController.loginRequired,categoriaVideoController.saveCategoria);

// DELETE /videos/categoria/:categoriaVideoId. Permite eliminar una determinada categoría de vídeos
router.delete("/videos/categorias/:categoriaVideoId(\\d+)",loginController.loginRequired,categoriaVideoController.destroyCategoria);

// GET /videos/categorias/:categoriaVideoId. Petición de la vista de edición de una categoría de vídeo
router.get("/videos/categorias/:categoriaVideoId(\\d+)",loginController.loginRequired,categoriaVideoController.getCategoria);


// PUT /videos/categorias/:categoriaVideoId. Petición de modificación de una determinada
// categoría de vídeo
router.put("/videos/categorias/:categoriaVideoId(\\d+)",loginController.loginRequired,categoriaVideoController.update);

/********************************************************************************/
/*************** END: API RESTFULL PARA LA GESTIÓN DE VIDEOS     ****************/
/********************************************************************************/


/********************************************************************************/
/*************** BEGIN: API RESTFULL PARA LA GESTIÓN DE USUARIOS ****************/
/********************************************************************************/

// POST /users/exists Comprueba si existe un usuario en la BD que tenga un
// determinado login y/o email
router.post("/users/exists",loginController.loginRequired,usersController.exists);

// POST /users. Da de alta un usuario en la base de datos
router.post('/users',loginController.loginRequired,usersController.create);

// GET /users. Recupera los usuarios del sistema que hayan sido dados de alta
router.get('/users',loginController.loginRequired,usersController.getUsers);

// DELETE /users/:userId/. Elimina un determinado usuario de la base de datos
router.delete("/users/:userId(\\d+)",loginController.loginRequired,usersController.delete);

// GET /users/:userId/. Recupera los datos de un determinado usuario de la BBDD
router.get("/users/:userId(\\d+)",loginController.loginRequired,usersController.getUser);

// PUT /users. Actualiza los datos de un usuario en la BBDD
router.put("/users/:userId(\\d+)",loginController.loginRequired,usersController.update);


/********************************************************************************/
/*************** BEGIN: END RESTFULL PARA LA GESTIÓN DE USUARIOS ****************/
/********************************************************************************/





/********************************************************************************/
/*************** BEGIN: API RESTFULL PARA EL MANEJO DE POSTS ********************/
/********************************************************************************/

// GET /posts2. Se recuperan los posts de un determinado usuario entre un rango determinado
router.get("/posts/:inicio(\\d+)/:fin(\\d+)",loginController.loginRequired,postController.getPosts);

// GET /posts2/num. Recupera el número total de posts creados por el usuario
router.get("/posts/num",loginController.loginRequired,postController.getNumTotalPosts);

// DELETE /posts2/:postId. Eliminar un determinado post. Se devuelve el mensaje de éxito
// o fracaso en JSON. 0 --> Si todo bien y 1 en caso contrario
router.delete("/posts/:postId(\\d+)",loginController.loginRequired,postController.deletePost);

// POST /post. Alta de un post en base de datos
router.post("/posts",loginController.loginRequired,postController.create);

// GET /posts/:postId
router.get("/posts/:postId(\\d+)",loginController.loginRequired,postController.getPost);

// PUT /posts/:postId
router.put("/posts/:postId(\\d+)",loginController.loginRequired,postController.update);

/********************************************************************************/
/***************** END: API RESTFULL PARA EL MANEJO DE POSTS ********************/
/********************************************************************************/


/********************************************************************************/
/********** BEGIN: API RESTFULL PARA LAS PELICULAS            *******************/
/********************************************************************************/

// GET /peliculas. Petición de recuperación de peliculas de un determinado usuario
router.get("/peliculas",loginController.loginRequired,peliculasController.getPeliculas);


// POST /peliculas. Petición de grabación de una película
router.post("/peliculas",loginController.loginRequired,peliculasController.save);

/********************************************************************************/
/***************   END: API RESTFULL PARA LAS PELICULAS    **********************/
/********************************************************************************/



/********************************************************************************/
/********** BEGIN: API RESTFULL PARA EL UPLOAD DE FICHEROS    *******************/
/********************************************************************************/

// POST /upload. Petición de upload de un archivo al servidor
router.post("/upload",loginController.loginRequired,uploadController.uploadFile);


/********************************************************************************/
/**********   END: API RESTFULL PARA EL UPLOAD DE FICHEROS    *******************/
/********************************************************************************/



/********************************************************************************/
/********** BEGIN: API RESTFUL PARA LA AUTENTICACIÓN DE USUARIOS ****************/
/********************************************************************************/

// POST /login. Petición de autenticación de un usuario
router.post("/login",loginController.autenticate);

/********************************************************************************/
/********** END: API RESTFUL PARA LA AUTENTICACIÓN DE USUARIOS ******************/
/********************************************************************************/


// POST /login. Petición de autenticación de un usuario
//router.post("/login",loginController.autenticate);

// GET /logout. Petición de cierre de sesión de un usuario del sistema
router.get("/logout",loginController.destroy);



// GET /. Página de entrada en el sistema
router.get('/',function(req,res){
	res.render('index',{errors:[]});
});


module.exports = router;
