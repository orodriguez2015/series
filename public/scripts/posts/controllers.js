'use strict';

angular.module('gestor')

    /**
        Controlador que recupera los posts del usuario del servidor, para 
        mostrar por pantalla
        @param $scope: $scope
        @param postService: Inyección del servicio PostService a través del cual
                se recuperan los posts del servidor 
      */
    .controller('PostController', ['$scope','postService','$state',   function($scope,postService,$state) {
        // Posts recuperados
        $scope.posts        = [];
        // Registro de inicio
        $scope.begin       = 0;
        // Registro de fin
        $scope.end          = 10;
        // Número de registros por página
        $scope.numPerPage   = 10;
        // Número total de registros
        $scope.numRegistros = 0;
        // Contiene la página actual. Por defecto será la 1
        $scope.currentPage = 1;
        // Mostrar botón de avanzar a los siguientes posts
        $scope.mostrarBotonSiguiente = false;
        // Mostrar botón anterior para hacer un recorrido por los posts hacia atrás
        $scope.mostrarBotonAnterior  = false;
        // Número de página anterior    
        $scope.paginaAnterior;
        // Número de página siguiente
        $scope.paginaSiguiente;
      
        /**
          * Muestra los posts de la página indicada en el parámetro
          * @param page: Número de la página
          */
        $scope.goToPage = function(page) {
            $scope.begin = ((page - 1) * $scope.numPerPage);
            $scope.end   = $scope.begin + $scope.numPerPage;
            $scope.currentPage = page;
            $scope.mostrarBotonSiguiente = false;
            $scope.mostrarBotonAnterior  = false; 
            
            /** Se recupera el número total de posts creados por el usuario actual */
            postService.getNumTotalPosts().then(
                
                // success action
                function(response) {
                    $scope.numRegistros = response.data;
                },

                // error action
                function(response) {
                    MessagesArea.showMessageError("Error al recuperar el número de posts los posts de la base de datos: " + response.descStatus);

                } 
            );
        
           /** Se recuperan los posts a mostrar en la página actual **/
           postService.getPosts().query({begin:$scope.begin,end:$scope.end},
                // success action
                function(response) {
                    $scope.posts = response;

                    if($scope.numTotalPaginas()>$scope.currentPage)
                        // Se muestra el botón Siguiente
                        $scope.mostrarBotonSiguiente = true;    
               
                    if($scope.currentPage>1)
                        $scope.mostrarBotonAnterior = true;
                },
                                        
                // error action
                function(response) {
                    MessagesArea.showMessageError("Error al recuperar los postsde la base de datos: " + response.descStatus);
                }
            );
            
        }// goToPage
        
        
        /** Devuelve el número total de páginas a mostrar **/
        $scope.numTotalPaginas = function () {
            var totalPaginas = Math.ceil($scope.numRegistros/$scope.numPerPage);
            return totalPaginas;
        };
        
        
        /**
          * Elimina un determinado POST de la BBDD
          * @param id: Id del post a eliminar
          */
        $scope.deletePost = function( id ) {
            MessagesArea.clearMessagesArea();
            
            postService.getPosts().delete({id:id}).$promise.then(
                // success action
                function(response) {
                    // Se muestra un mensaje de éxito
                    MessagesArea.showMessageSuccess("<b>Operación correcta:</b> Post eliminado");
                    // Se recarga la página actual para recargar la vista
                    $scope.goToPage($scope.currentPage);
                },
                // error function
                function(response) {
                    MessagesArea.showMessageError("<b>Operación incorrecta:</b> No se ha podido eliminar el post");
                }
            ); 
        };
        
        
        /**
          * Función invocada para editar un determinado post.
          * Redirige a la pantalla de edición de post
          * @param id: Id del post
          */
        $scope.editarPost = function(id) {
            console.log("editarPost");
            $state.go("app.editpost",{id:id});
        };
        
        // Por defecto se carga la página número 1
        $scope.goToPage(1);

    }])


     /**
        Controlador asignado al formulario de alta de una nueva entrada
        en el blog
        @param $scope: $scope
        @param postService: Inyección del servicio PostService a través del cual
                se recuperan los posts del servidor 
      */
    .controller('NewPostController', ['$scope','postService','$state', function($scope,postService,$state) {
        // Objeto que contendra los datos del post a dar de alta
        $scope.post = {
            titulo: '',
            descripcion: ''
        };
        
        $scope.newPost = function() {
            console.log("titulo: " + $scope.post.titulo + ", desc: " + $scope.post.descripcion);
            
            if($scope.post.titulo.length>=1 && $scope.post.descripcion.length>=1) {
                MessagesArea.clearMessagesArea();
                postService.getPosts().save($scope.post).$promise.then(
                    // success action
                    function(response) {
                        console.log("alta de post realizada");
                        MessagesArea.showMessageSuccess("<b>Operación correcta:</b> Se ha dado de alta la entrada en blog correctamente");
                        // Se vacía los campos de formulario
                        $scope.post.titulo      = '';
                        $scope.post.descripcion = '';
                        // Se indica que el formulario no ha sido modificado
                        $scope.altaPostForm.$setPristine();

                    },
                    // error action
                    function(response) {
                        console.log("respuesta: " + JSON.stringify(response));
                        MessagesArea.showMessageError("<b>Operación incorrecta:</b> No se ha podido dar del alta el post: " + response.data);
                    }
                );
            }// if
        };
        
        $scope.back = function() {
            //window.location.assign('#/blog') 
             $state.go("app.posts");
        };
        
        
    }])



 .controller('EditPostController', ['$scope','postService','$state','$stateParams', function($scope,postService,$state,$stateParams) {
        
    var id = $stateParams.id;
    console.log("id: " + id);
    // Objeto que contendra los datos del post a dar de alta
    $scope.post = {
        id: '',
        titulo: '',
        descripcion: ''
    };

    if(id==undefined || id=='') {
        MessagesArea.showMessageError("Entrada desconocida");

    } else {
        
         postService.getPost().get({id:id}).$promise.then(
                                     
            // success action
            function(response) {
                $scope.post.id = response.id;
                $scope.post.titulo = response.titulo;
                $scope.post.descripcion = response.descripcion;
            },

            // error action
            function(response) {
                MessagesArea.showMessageError("Error al recuperar la entrada de la base de datos: " + response.statusText);
            }
        );
     }// else 
     
     
     /**
       * Función que permite volver hacia atrás en el historial 
       */
     $scope.back = function() {
       $state.go("app.posts");  

     };
     
     
     /**
       * Función que es llamada para editar la entrada
       */
     $scope.editPost = function() {
            
         postService.getPost().update({id:id},$scope.post).$promise.then(
            function(response) {
                MessagesArea.showMessageSuccess("La entrada ha sido actualizado");
            },
            
            function(response) {
                MessagesArea.showMessageError("Se ha producido un error al actualizar la entrada e n la base de datos");
            } 
         );
         
     };
        
}])


/******************************************************************/
/********************** LoginController ***************************/
/******************************************************************/
.controller('LoginController', ['$scope','loginService','authenticationFactory','$state', function($scope,loginService,authenticationFactory,$state) {
        
    $scope.authenticate = {
        login:'',
        password: ''
    };
    
    
    $scope.login = function () {
    
        loginService.validate($scope.authenticate).$promise.then(
            // success function               
            function(response) {
                
                switch(response.status) {
                    
                    case 0: 
                        authenticationFactory.authenticate(response);
                        $state.go('app');
                        MessagesArea.showMessageSuccess("Autenticación correcta"); 
                       break;
                        
                    case 1: MessagesArea.showMessageError("Datos del usuario incorrecto");    
                       break;    
                        
                    default: MessagesArea.showMessageError("Datos del usuario incorrecto");    
                              break;         
                };
                

            },                
              
            // error function               
            function(response) {
                MessagesArea.showMessageError("Se ha producido un error al comprobar la existencia del usuario: " + response.statusText);
            }                   
                          
        );
        
    };
         
}])



/******************************************************************/
/********************** UsersController ***************************/
/******************************************************************/
.controller('UsersController', ['$scope','userServiceCheck','$state', function($scope,userServiceCheck,$state) {
        
    $scope.usuario = {
        nombre:'',
        apellido1: '',
        apellido2: '',
        email: '',
        login:'',
        password:''
    };
    
    /**
      * Función invocada cuando se pretender dar de alta un nuevo usuario
      */
    $scope.altaUsuario = function() {
        
        // 1.- Se comprueba si ya existe otra cuenta del usuario con el 
        //     login e email indicado
        var datos = {
            login: $scope.usuario.login,
            email: $scope.usuario.email
        };
                
        
        // Se comprueba si el login y el email ya están asociados a otro usuario
        userServiceCheck.existencia().comprobar(datos).$promise.then(
            // success action
            function(response) {
                
                var errorMessage = "";   
            
                MessagesArea.clearMessagesArea();
                
                if(response.status==-1) {
                    errorMessage = "Se ha producido un error técnico al validar el login del usuario";  
                } else
                if(response.status==-2) {
                    errorMessage = "Se ha producido un error técnico al validar el email del usuario";  
                } else   
                if(response.status==0) {
                    
                    if(response.login && response.email) {
                        errorMessage = "El login y la dirección de correo electrónico ya están asociados a otro/s usuario/s";     
                    } else
                    if(response.login && !response.email) {
                        errorMessage = "El login ya se encuentra asignado a otro usuario";     
                    } else
                    if(!response.login && response.email) {
                        errorMessage = "La dirección de correo electrónico ya se encuentra asociado a otro usuario";              
                    }
                }
                
                if(errorMessage!="" && errorMessage.length>0)
                    MessagesArea.showMessageError(errorMessage);
                else {
        
                    // 2.- Se procede a dar de alta el usuario             
                    userServiceCheck.usuario().save($scope.usuario).$promise.then(
                        // success
                        function(response) {
                            MessagesArea.showMessageSuccess("Operación correcta: Usuario dado de alta con éxito")
                        },
                        
                        // error
                        function(response) {
                            MessagesArea.showMessageError("Se ha producido un error al dar de alta el usuario");
                        }
                    );
                }
                
            },
            
            // error action
            function(response) {
                MessagesArea.showMessageError("Error al verificar la existencia de algún usuario con los datos introducidos");
            }
        );
        
    };
    
  
}]);