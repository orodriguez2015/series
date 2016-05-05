'use strict';

angular.module('gestor')

    /**
        Controlador que recupera los posts del usuario del servidor, para
        mostrar por pantalla
        @param $scope: $scope
        @param postService: Inyección del servicio PostService a través del cual
                se recuperan los posts del servidor
      */
    .controller('PostController', ['$scope','postService','$state', function($scope,postService,$state) {
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

            $scope.post.descripcion = $('#descripcion').val();

            if($scope.post.titulo.length>=1 && $scope.post.descripcion.length>=1) {
                MessagesArea.clearMessagesArea();
                postService.getPosts().save($scope.post).$promise.then(
                    // success action
                    function(response) {
                        MessagesArea.showMessageSuccess("<b>Operación correcta:</b> Se ha dado de alta la entrada en blog correctamente");
                        // Se vacía los campos de formulario
                        $scope.post.titulo      = '';
                        $scope.post.descripcion = '';
                        // Se indica que el formulario no ha sido modificado
                        $scope.altaPostForm.$setPristine();

                    },
                    // error action
                    function(response) {
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
                console.log("antes");
                console.log("descripcion : " + JSON.stringify($('#descripcion')));
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
                        // Se recupera la variable del sessionStorage que contiene el
                        // estado desde el que se ha hecho la petición, para redirigir
                        // el control a dicha pantalla
                        var redireccion = recordingSessionStorage.getElement("toStateName");
                        $state.go(redireccion);
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
.controller('VideoController', ['$scope','youtubeService', function($scope,youtubeService) {

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
              q: $scope.busqueda,
              regionCode: "es",
              order: "viewCount"

        };

        // Se buscan los vídeos en el API de Youtube
        youtubeService.searchVideos().get(params).$promise.then(
            function(data) {
                $scope.videos = data.items;
                //resetVideoHeight();
            },

            function(response) {
                MessagesArea.showMessageError("Error al realizar la búsqueda de vídeos en Youtube");
            }
        );
    }


    /**
      * Función que se invoca cuando el usuario desea visualizar un vídeo
      * @param id: Id del vídeo en youtube
      */
    $scope.showVideo = function(id) {
        mostrarVideo(id);
    };


    /**
      * Función que es invocada cuando se pretende guardar un vídeo como favorito
      * @param id (int): Id del vídeo
      * @param titulo (String): Título del vídeo
      * @param urlImagen (String): URL de la imagen
      * @param descripcionVideo (String): Descripción del vídeo
      * @param canalId (String): Id del canal
      * @param tituloCanal (String): Descripción del canal
      */
    $scope.saveVideo = function(id,titulo,urlImagen,descripcionVideo,canalId,tituloCanal) {

      var param = {
        videoId: id,
        canalId:canalId,
        descCanal: tituloCanal,
        titulo: titulo,
        descripcion: descripcionVideo,
        urlImagen: urlImagen
      };

      youtubeService.video().save(param).$promise.then(
          // success action
          function(data) {
            console.log("OK grabacion video: " + JSON.stringify(data));
            if(data.status!=0) {
              MessagesArea.showMessageError("Error al guardar el vídeo como favorito");
            } else
            if(data.status==0) {
              MessagesArea.showMessageSuccess("Operación correcta: Vídeo grabado");
            }
          },

          // error action
          function(data) {
            console.log("ERROR grabacion video: ");
          }
      );

    }// saveVideo


}])


/**********************************************************************************/
/********************** CategoriaVideoYoutubeController ***************************/
/**********************************************************************************/
.controller('CategoriasVideoYoutubeController', ['$scope','categoriaVideoYoutubeService','$state', function($scope,categoriaVideoYoutubeService,$state) {

  // Variable que contiene las categorías
  $scope.categorias;

  // Se recupera las categorías de vídeo del servidor
  categoriaVideoYoutubeService.categorias().query().$promise.then(
      // Success action
      function(categorias) {
          $scope.categorias = categorias;
      },

      // Error action
      function(error) {
        console.log("Error al recuperar categorias: " + error.message);
        MessagesArea.showMessageError("Error al recuperar las diferentes categorías");
      }
  );

  /**
    * Función privada que devuelve el número de vídeos que están asociados
    * a una determinada categoría
    * @param id (Integer): Id de la categoría
    */
  $scope.buscarNumVideosCategoria = function(id) {
    var num = 0;
    for(var i=0;i<$scope.categorias.length;i++) {
      if($scope.categorias[i].id==id) {
        num = $scope.categorias[i].videoYoutubes.length;
      }
    }// for

    return num;
  },

  /**
    * Función que es invocada cuando se desea eliminar una categoría
    * @param id (Integer): Identificador de una categoría
    */
  $scope.destroyCategoria = function(id) {

    MessagesArea.clearMessagesArea();
    if($scope.buscarNumVideosCategoria(id)>=1){
      MessagesArea.showMessageError("No se permite eliminar la categoría puesto que tiene vídeos asociados");
    } else {

      bootbox.confirm('¿Desea eliminar la categoría?', function(result) {
        if(result) {
          categoriaVideoYoutubeService.categorias().delete({id:id}).$promise.then(
              // Success action
              function(data) {
                  if(data.status==0) {
                    // Se recarga el state actual
                    $state.go($state.current, {}, {reload: true});

                  }
              },
              // Error action
              function (error) {
                  MessagesArea.showMessageError("Error al eliminar la categoría seleccionada");
              }
          );
        }
      });
   }

  };


  /**
    * Función que es invocada cuando un usuario desea editar
    * una determinada categoría
    * @param idCategoria: Id de la categoria
    */
  $scope.loadEditCategoria = function(idCategoria) {
    // Se hace una redirección al estado de edición de vídeo
    $state.go("app.editCategoriaVideo",{id:idCategoria});
  };

}])


/**********************************************************************************/
/**********************   NewCategoriaVideoController   ***************************/
/**********************************************************************************/
.controller('NewCategoriaVideoController', ['$scope','categoriaVideoYoutubeService','$state', function($scope,categoriaVideoYoutubeService,$state) {

  // Variable que contiene el nombre de una categoria (Alta de categoría)
  $scope.nombre;
  // Variable que contiene la descripción de una categoria (Alta de categoría)
  $scope.descripcion;


  /**
    * Función que se invoca cuando un usuario desea almacenar una
    * categoría
    */
  $scope.saveCategoria = function() {

    categoriaVideoYoutubeService.categorias().save({nombre:$scope.nombre,descripcion:$scope.descripcion}).$promise.then(
      // Success action
      function(data) {
          MessagesArea.showMessageSuccess("Categoría grabada correctamente");
      },

      // Error action
      function(error) {
        MessagesArea.showMessageError("Error al grabar la categoría: " + error.message);
      }

    );
  }


  $scope.volver = function() {
    $state.go('app.categoriasyoutube');
  }

}])


/**********************************************************************************/
/**********************   EditCategoriaVideoController   ***************************/
/**********************************************************************************/
.controller('EditCategoriaVideoController', ['$scope','categoriaVideoYoutubeService','$stateParams','$state', function($scope,categoriaVideoYoutubeService,$stateParams,$state) {

  // Variable que contiene el nombre de una categoria (Alta de categoría)
  $scope.nombre;
  // Variable que contiene la descripción de una categoria (Alta de categoría)
  $scope.descripcion;
  // Id de la categoría que se está editando
  $scope.id = $stateParams.id;

  // Se recupera la categoría del servidor
  categoriaVideoYoutubeService.categorias().get({id:$stateParams.id}).$promise.then(
      // Success action
      function(data) {
        $scope.nombre      = data.nombre;
        $scope.descripcion = data.descripcion;
      },

      // Error action
      function(error) {
          MessagesArea.showMessageError("Se ha producido un error al recuperar la categoría: " + error.message);
      }
  );

  /**
    * Función que se invoca cuando un usuario desea almacenar una
    * categoría
    */
  $scope.editCategoria = function() {

    categoriaVideoYoutubeService.categorias().update({id:$scope.id},{nombre:$scope.nombre,descripcion:$scope.descripcion}).$promise.then(
      // Success action
      function(data) {
          MessagesArea.showMessageSuccess("Categoría actualizada correctamente");
      },

      // Error action
      function(error) {
        MessagesArea.showMessageError("Se ha producido un error al actualizar la categoría: " + error.message);
      }
    );

  }

  /**
    * Función invocada cuando el usuario desea volver
    * hacia el listado de categorías
    */
  $scope.volver = function() {
    $state.go('app.categoriasyoutube');
  }

}])




/**********************************************************************************/
/*************************   NewPeliculaController        *************************/
/**********************************************************************************/

.controller('NewPeliculaController', ['$scope','peliculasService',function($scope,peliculasService) {

  $scope.pelicula = {
    titulo:'',
    descripcion:'',
    visto:false,
    puntuacion: ''
  }

  $scope.newPelicula = function() {

      peliculasService.peliculas().save($scope.pelicula).$promise.then(
          // Success action
          function(data) {

            if(data.status==0) {
              MessagesArea.showMessageSuccess('La pelicula ha sido grabada correctamente');
            }

            $scope.pelicula.titulo      = '';
            $scope.pelicula.descripcion = '';
            $scope.pelicula.visto       = false;
            $scope.pelicula.puntuacion  = '';

            // Se indica que el formulario no ha sido modificado
            $scope.altaPeliculaForm.$setPristine();
            // Se indica que ningún campo de formulario ha sido tocado
            $scope.altaPeliculaForm.$setUntouched();

          },

          // Error action
          function(error) {
            console.log("Se ha producido un error al grabar la película: " + error.message);
            MessagesArea.showMessageError('Se ha producido un error al grabar la película');
          }
      );
  };
}])


/**********************************************************************************/
/*************************   PeliculasController         *************************/
/**********************************************************************************/

.controller('PeliculasController', ['$scope','peliculasService','$state',function($scope,peliculasService,$state) {
  $scope.peliculas;

  // Ha sido necesario en el servicio indicar que la operación get devuelve un array
  peliculasService.peliculas().get().$promise.then(
    // Success action
    function(data) {
      $scope.peliculas = data;
    },

    // Error action
    function(data){
      MessagesArea.showMessageError("Se ha producido un error al recuperar las películas");
    }
  );



  $scope.eliminarPelicula = function(id) {

      MessagesArea.clearMessagesArea();

      // Se pregunta al usuario si desea eliminar la entrada.
      // Se hace de bootbox.js (require de jquery y bootstrap)
      bootbox.confirm('¿Desea eliminar la película?', function(result) {

           if(result) {

              peliculasService.peliculas().delete({id:id}).$promise.then(
              // success action
              function(response) {
                  // Se recarga la página actual para recargar la vista
                  $state.go($state.current, {}, {reload: true});
              },
              // error function
              function(response) {
                  MessagesArea.showMessageError("<b>Operación incorrecta:</b> No se ha podido eliminar el post");
              }
              );
           }

       });
   }// eliminarPelicula


   /**
     * Función invocada a la hora de editar una película
     * @param id: Id de la película
     */
   $scope.editPelicula = function(id) {
        $state.go("app.editPelicula",{id:id});
   };

}])



/**********************************************************************************/
/*************************   PeliculasController         *************************/
/**********************************************************************************/

.controller('EditPeliculasController', ['$scope','peliculasService','$stateParams',function($scope,peliculasService,$stateParams) {

    var id = $stateParams.id;

    $scope.pelicula = {
      id:'',
      titulo:'',
      descripcion:'',
      visto:false,
      puntuacion: ''
    }

    // Se recupera la película del servidor
    peliculasService.peliculas().getPelicula({id:id},$scope.pelicula).$promise.then(
      // success action
      function(pelicula) {
          $scope.pelicula.id = pelicula.id;
          $scope.pelicula.titulo      = pelicula.titulo;
          $scope.pelicula.descripcion = pelicula.descripcion;
          if(pelicula.visto!=undefined && pelicula.visto==1) {
            $scope.pelicula.visto = true;
          }

          $scope.pelicula.puntuacion = String(pelicula.puntuacion);

      },
      // error function
      function(response) {
          MessagesArea.showMessageError("<b>Operación incorrecta:</b> No se ha podido recuperar la película");
      }
    );


   /**
     * Función invocada a la hora de editar una película
     * @param id: Id de la película
     */
   $scope.editPelicula = function(id) {

        console.log("pelicula: " + JSON.stringify($scope.pelicula));
        console.log("pelicula id: " + $scope.pelicula.id);

        peliculasService.peliculas().update({id:$scope.pelicula.id},$scope.pelicula).$promise.then(
            // Success action
            function(response) {
              console.log("película actualizada");
              MessagesArea.showMessageSuccess("<b>Operación correcta:</b> La película ha sido actualizada");
            },

            // Error action
            function(response) {
                MessagesArea.showMessageError("<b>Operación incorrecta:</b> Se ha producido un error al actualizar la película");
            }
        );
   };

}])


/**********************************************************************************/
/*************************   UploadFileController         *************************/
/**********************************************************************************/

.controller('UploadFileController', ['$scope','$http' ,function($scope,$http) {

  $scope.enviar=function() {
        var file = $scope.archivo;

        console.log("file " + JSON.stringify(file));

        if(file!=null && file!=undefined) {
          var fd = new FormData();
          fd.append('file', file);
          fd.append('tipoArchivo','imagen');
          fd.append('destino','cualquiera');

          $http.post('/upload', fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
              })
              .success(function(response){
                  //Guardamos la url de la imagen y hacemos que la muestre.

                  MessagesArea.clearMessagesArea();
                  if(response.status==0) {
                    MessagesArea.showMessageSuccess("Archivo enviado al servidor");
                  } else
                  if(response.status==1){
                    MessagesArea.showMessageError("No se ha podido copiar el archivo desde el directorio temporal al directorio de destino");
                  } else {
                    MessagesArea.showMessageError("No sido seleccionado ningún archivo");
                  }
                  //$scope.archivo=false;
                  //$scope.img=true;
                  console.log("Archivo enviado al servidor");
              })
              .error(function(response){
                  console.log("Error al enviar el archivo: " + response.message);
          });
        } else {
            MessagesArea.showMessageError("Es necesario que seleccione un archivo");
        }
  };

}]);
