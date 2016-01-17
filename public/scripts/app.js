'use strict';

// Se incluye a nivel de módulo, ui.router y ngResource (para usar en lugar de $http).
// Se incluye ngCookie para el manejo de las cookies
angular.module('gestor', ['ui.router','ngResource','ngCookies'])


.config(function($stateProvider, $urlRouterProvider,$locationProvider) {
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
                        controller  : 'UsersController'
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
.run(function($rootScope,$state,$cookieStore){
    
    // Cuando se detecte el cambio de estado, entonces se comprueba si el usuario se ha 
    // autenticado en la aplicación
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
    if (toState.module === 'private' && ($cookieStore.get('conectado')==null || $cookieStore.get('conectado')==false)) {
        // Usuario no logueado, se hace una redirección hacia la pantalla de login
        e.preventDefault();
        $state.go('app.login');
    }
});

})