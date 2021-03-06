'use strict';

// Se incluye a nivel de módulo, ui.router y ngResource (para usar en lugar de $http).
// Se incluye ngCookie para el manejo de las cookies
angular.module('gestor', ['ui.router','ngResource','ngCookies','ngSanitize'])


.config(function($stateProvider, $urlRouterProvider,$locationProvider,$httpProvider) {

        $stateProvider
            // ruta para la página principal
            .state('app', {
                module: 'public',
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/template/header.html',
                    },
                    'content': {
                        templateUrl : 'views/template/index.html'

                    },
                    'footer': {
                        templateUrl : 'views/template/footer.html',
                    }
                }
            })


            // Ruta para el listado de posts del usuario
            .state('app.posts', {
                module: 'private',
                url:'blog',
                views: {
                    'content@': {
                        templateUrl : 'views/posts/index.html',
                        controller  : 'PostController'
                    }
                }
            })

            .state('app.newpost', {
                module: 'private',
                url:'blog.new',
                views: {
                    'content@': {
                        templateUrl : 'views/posts/create.html',
                        controller  : 'NewPostController'
                    }
                }
            })


            .state('app.editpost', {
                module: 'private',
                url:'blog.edit/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/posts/edit.html',
                        controller  : 'EditPostController'
                    }
                }
            })


            .state('app.newuser', {
                module: 'private',
                url:'users.new',
                views: {
                    'content@': {
                        templateUrl : 'views/users/create.html',
                        controller  : 'NewUserController'
                    }
                }
            })


            .state('app.edituser', {
                module: 'private',
                url:'users.edit/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/users/edit.html',
                        controller  : 'EditUserController'
                    }
                }
            })


            .state('app.users', {
                module: 'private',
                url:'users',
                views: {
                    'content@': {
                        templateUrl : 'views/users/index.html',
                        controller  : 'UsersController'
                    }
                }
            })


            .state('app.youtube', {
                module: 'private',
                url:'youtube',
                views: {
                    'content@': {
                        templateUrl : 'views/videos/index.html',
                        controller  : 'VideoController'
                    }
                }
            })


            .state('app.videosUsuario', {
                module: 'private',
                url:'videosUsuario',
                views: {
                    'content@': {
                        templateUrl : 'views/videos/userVideos.html',
                        controller  : 'VideosUsuarioController'
                    }
                }
            })


            .state('app.categoriasyoutube', {
                module: 'private',
                url:'categoriasYoutube',
                views: {
                    'content@': {
                        templateUrl : 'views/videos/categorias.html',
                        controller  : 'CategoriasVideoYoutubeController'
                    }
                }
            })


            .state('app.createcategoriavideo', {
                module: 'private',
                url:'createCategoria',
                views: {
                    'content@': {
                        templateUrl : 'views/videos/create.html',
                        controller  : 'NewCategoriaVideoController'
                    }
                }
            })


            .state('app.editCategoriaVideo', {
                module: 'private',
                url:'editCategoria/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/videos/editCategoria.html',
                        controller  : 'EditCategoriaVideoController'
                    }
                }
            })


            .state('app.upload', {
                module: 'private',
                url:'upload',
                views: {
                    'content@': {
                        templateUrl : 'views/upload/upload.html',
                        controller  : 'UploadFileController'
                    }
                }
            })

            .state('app.peliculas', {
                module: 'private',
                url:'peliculas',
                views: {
                    'content@': {
                        templateUrl : 'views/peliculas/index.html',
                        controller  : 'PeliculasController'
                    }
                }
            })


            .state('app.newPelicula', {
                module: 'private',
                url:'newPelicula',
                views: {
                    'content@': {
                        templateUrl : 'views/peliculas/create.html',
                        controller  : 'NewPeliculaController'
                    }
                }
            })


            .state('app.editPelicula', {
                module: 'private',
                url:'editPelicula/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/peliculas/edit.html',
                        controller  : 'EditPeliculasController'
                    }
                }
            })

            .state('app.login', {
                module: 'public',
                url:'login',
                views: {
                    'content@': {
                        templateUrl : 'views/login/login.html',
                        controller  : 'LoginController'
                    }
                }
            });



            $urlRouterProvider.otherwise('/');

    })


// Esta función se ejecutará siempre, y se usará para comprobar si
// un usuario está autenticado, sino lo está se hace una redirección a la pantalla
// de login.
.run(function($rootScope,$state,$cookieStore,$location){

  /*
  $rootScope.$on('$locationChangeSuccess', function() {
      $rootScope.actualLocation = $location.path();
  });
*/

    // Cuando se detecte el cambio de estado, entonces se comprueba si el usuario se ha
    // autenticado en la aplicación
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {

      // Variable que contiene el nombre del estado del que el usuario ha hecho click
      var toStateName = toState.name;

      if (toState.module === 'private' && (recordingSessionStorage.getElement('conectado')==null || recordingSessionStorage.getElement('conectado')==false)) {
          // Usuario no logueado, se hace una redirección hacia la pantalla de login
          e.preventDefault();

          // Se almacena en el sessionStorage un variable que contiene el nombre
          // del estado desde el que se hace la petición, y para la que es necesario
          // que el usuario se autentique
          recordingSessionStorage.saveElement("toStateName",toState.name);
          $state.go('app.login');
      };
    });


    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
        // TODO
    });

})
