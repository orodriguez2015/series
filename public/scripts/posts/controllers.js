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
            
             // Se pregunta al usuario si desea eliminar la entrada. 
             // Se hace de bootbox.js (require de jquery y bootstrap)
             bootbox.confirm('¿Desea eliminar la entrada?', function(result) {
                 
                 if(result) {
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
                 }
                 
             }); 

        };
        
        
        /**
          * Función invocada para editar un determinado post.
          * Redirige a la pantalla de edición de post
          * @param id: Id del post
          */
        $scope.editarPost = function(id) {
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
            
            
            $scope.post.descripcion = $('#descripcion').val();
            
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


/******************************************************************/
/******************** EditPostController **************************/
/******************************************************************/

 .controller('EditPostController', ['$scope','postService','$state','$stateParams', function($scope,postService,$state,$stateParams) {
        
    var id = $stateParams.id;
    
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
                $('#descripcion').val(response.descripcion);
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
         $scope.post.descripcion = $('#descripcion').val();
         
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



/********************************************************************/
/********************** NewUserController ***************************/
/********************************************************************/
.controller('NewUserController', ['$scope','userServiceCheck', function($scope,userServiceCheck) {
        
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
                            MessagesArea.showMessageSuccess("Operación correcta: Usuario dado de alta con éxito");
                            
                            // Se vacía el formulario
                             $scope.usuario = {
                                nombre:'',
                                apellido1: '',
                                apellido2: '',
                                email: '',
                                login:'',
                                password:''
                            };
                            
                            // Se indica que el formulario no ha sido modificado
                            $scope.altaUsuarioForm.$setPristine();
                            // Se indica que ningún campo de formulario ha sido tocado
                            $scope.altaUsuarioForm.$setUntouched();
                            
                            
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
    
  
}])



/********************************************************************/
/********************** EditUserController **************************/
/********************************************************************/
.controller('EditUserController', ['$scope','userServiceCheck','$stateParams', function($scope,userServiceCheck,$stateParams) {
        
    // Se recupera el id del usuario de la url, ya que se pasa como parámetros
    var id = $stateParams.id;
    
    $scope.usuario = {
        id: id,
        nombre:'',
        apellido1: '',
        apellido2: '',
        email: '',
        login:'',
        password:''
    };
    
    
    /** Se recuperan los datos del usuario del servidor **/
    userServiceCheck.usuario().get({id:id}).$promise.then(
        // success action
        function(user) {
            $scope.usuario.id = id;
            $scope.usuario.nombre = user.nombre;
            $scope.usuario.apellido1 = user.apellido1;
            $scope.usuario.apellido2 = user.apellido2;
            $scope.usuario.email = user.email;
            $scope.usuario.login = user.login;
            $scope.usuario.password = user.password;   
        },
        // error action
        function(response) {
            MessagesArea.showMessageError("Operación incorrecta: Error al recuperar el usuario de la base de datos");
        }
    );
    
    
    /**
      * Función que es llamada para editar un usuario y persistir los
      * cambios en la base de datos 
      */
    $scope.editarUsuario = function() {
       console.log("$scope.usuario: " + JSON.stringify($scope.usuario)); 
        
        userServiceCheck.usuario().update({id:$scope.usuario.id},$scope.usuario).$promise.then(
            // success action
            function(response) {
                MessagesArea.showMessageSuccess("<b>Operación correcta</b>: Datos del usuario actualizado en base de datos");     
            },
            
            // error action
            function(response) {
                MessagesArea.showMessageError("<b>Operación incorrecta</b>: Error al actualizar el usuario en la  base de datos");     
            }
        
        );
    };
    
}])


/******************************************************************/
/********************** UsersController ***************************/
/******************************************************************/
.controller('UsersController', ['$scope','userServiceCheck','$state', function($scope,userServiceCheck,$state) {
        
    $scope.users = [];
    
    userServiceCheck.usuario().query().$promise.then(
        
        // success action
        function(response) {
            $scope.contador =1
            console.log("contador: " + $scope.contador);
            $scope.contador++;
            $scope.users = response;
            
        },
        // error action
        function(response) {
            MessagesArea.showMessageError('Operación incorrecta: Error al recuperar los usuarios de la base de datos');       
        }
    );
    
    
    /**
      * Eliminar un determinado usuario de la base de datos
      * @param id: Id del usuario
      */
    $scope.deleteUser = function(id) {
        
        
        bootbox.confirm('¿Desea eliminar el usuario?', function(result) {
        
            if(result) {
                userServiceCheck.usuario().delete({id:id}).$promise.then(

                    // success action
                    function(response) {

                        // Se ha eliminado el usuario, entonce se obliga a recargar
                        // el estado actual
                        $state.go($state.current, {}, {reload: true}); 

                    },

                    // error action
                    function(response) {
                        MessagesArea.showMessageError('Operación incorrecta: Error al eliminar el usuario de la base de datos');       
                    }
                );
            }

        });
    };
    
    
    $scope.editUser = function(id) {
    
        console.log("editar usuario " + id);
        // Se pasa el control al controlador de edición de usuario
        $state.go("app.edituser",{id:id});
        
    };
    
}])


/******************************************************************/
/********************** VideoController ***************************/
/******************************************************************/
.controller('VideoController', ['$scope','$state','youtubeService','$http','$resource', function($scope,$state,youtubeService,$http,$resource) {
        
    console.log("VideoController");
    
    // Variable que contendrá los vídeos buscados por el usuario directamente
    // en Youtube
    $scope.videos;
    // Campo de formulario que contiene la descripción de los vídeos a buscar
    $scope.busqueda = "";
    // Campo de formulario que contiene el número de vídeos máximo a recuperar
    $scope.numero   = "50";
    
    /**
      * Función que se encarga de limpiar el formulario de búsqueda, 
      * y el contenedor de vídeos
      */
    $scope.limpiar = function() {
        
        $scope.busqueda = "";
        $scope.videos = [];
        //$("#results").html("");
        // Se oculta la capa del vídeo de youtube y se para la reproduccción
        ocultarReproductorYoutube(); 
    };
    

    /**
      * Función de búsqueda de vídeos en youtube 
      *
      */
    $scope.searchVideos = function() {
        
        ocultarReproductorYoutube(); 
        
        console.log("A buscar: " + $scope.busqueda + " en numero de : " + $scope.numero);
    
        // Parámetros de búsqueda de vídeos en youtube
        var params =  {
              key: 'AIzaSyCY9xryyOVZkhySj6xRygDGzSegW8acbAY',
              type: 'video',
              maxResults: $scope.numero,
              pageToken: '',
              part: 'snippet',
              fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle,nextPageToken',
              q: $scope.busqueda,
              regionCode: "es",
              order: "viewCount"
            
        };
        
        // Se buscan los vídeos en el API de Youtube
        youtubeService.searchVideos().get(params).$promise.then(
            function(data) {
                console.log(JSON.stringify(data.items));
                $scope.videos = data.items;
                resetVideoHeight();
            },
            
            function(response) {
                MessagesArea.showMessageError("Error al realizar la búsqueda de vídeos en Youtube");
            }
        );
        
          
    } // function
        
        
        
  

    
    
    $scope.showVideo = function(id) {
        
        mostrarVideo(id);
    }
    
    
    
   
    
}]);