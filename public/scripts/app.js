'use strict';

// Se incluye a nivel de módulo, ui.router y ngResource (para usar en lugar de $http)
angular.module('gestor', ['ui.router','ngResource'])

.config(function($stateProvider, $urlRouterProvider,$locationProvider) {
        $stateProvider
            // ruta para la página principal
            .state('app', { 
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
                url:'blog',
                views: {
                    'content@': {
                        templateUrl : 'views/posts/index.html',
                        controller  : 'PostController'
                    }
                }
            })
        
            .state('app.newpost', { 
                url:'blog.new',
                views: {
                    'content@': {
                        templateUrl : 'views/posts/create.html',
                        controller  : 'NewPostController'
                    }
                }
            })
        
        
            .state('app.editpost', { 
                url:'blog.edit/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/posts/edit.html',
                        controller  : 'EditPostController'
                    }
                }
            })
        
            .state('app.login', { 
                url:'login',
                views: {
                    'content@': {
                        templateUrl : 'views/login/login.html',
                        controller  : 'LoginController'
                    }
                }
            });
         
            $urlRouterProvider.otherwise('/');
   
    });
