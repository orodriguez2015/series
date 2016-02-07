'use strict';

angular.module('gestor')

    // Se define la constante baseUrl para usar en el servicio
    .constant("baseUrl","http://localhost:5000/")

    // Se inyecta $resource en lugar de $http y baseUrl para el servicio
    .service('postService',['$resource','$http','baseUrl', function($resource,$http,baseUrl) {

        // Se recuperan los posts del servidor
        this.getPosts = function(inicio,fin){
            return $resource(baseUrl+"posts/:id/:begin/:end",null,  {'update':{method:'PUT' },'delete':{method:'DELETE'},'save':{method:'POST'},'get': {method:'GET'}});
        };
        
        
        // Se recupera el número de post a través de $http ya que $resource es
        // válido para API REST solo
        this.getNumTotalPosts = function() {
            return $http.get(baseUrl + "posts/num");
        };
        
        
        /**
          * Recuperar un determinado post
          * @param id: Id del post
          */
        this.getPost = function(id,post) {
             return $resource(baseUrl+"posts/:id",post,  {'update':{method:'PUT' },'delete':{method:'DELETE'},'save':{method:'POST'},'get': {method:'GET'}});
        };
        
    }])



    /**************************************************************/
    /*********************** LoginService *************************/
    /**************************************************************/
    .service('loginService',['$resource','baseUrl', function($resource,baseUrl) {

        return $resource(baseUrl+"login",null,  {'validate':{method:'POST'},'get': {method:'GET'}});
    
    }])



    /**************************************************************/
    /*********************** UserService  *************************/
    /**************************************************************/
   .service('userServiceCheck',['$resource','baseUrl','$q','$http', function($resource,baseUrl,$q,$http) {

       /**
         * Retorna la conexión al servicio RESTFUL que permite comprobar la existencia
         * de un usuario con el login e email indicados que habrá que pasar como
         * parámetros al método comprobar
         */
        this.existencia = function() {
           return $resource(baseUrl+"users/exists",null,{'comprobar': {method:'POST'}});
        };
            
        /**
          * Retorna la conexión al servicio RESTFUL.
          *   Para el alta de usuario se usa el método $resource.save()
          *   Para recuperar la lista de usuarios se usa el método $resource.query()
          *   Para eliminar un usuario se usa el método $resource.delete()
          *   Para editar un usuario se usa el método $resource.update()
          */
        this.usuario = function (id,user) {
            
        return $resource(baseUrl+"users/:id",user,{'save': {method:'POST'},'delete':{method:'DELETE'},'update':{method:'PUT'}});   
               
        };
       
       
        this.prueba = function() {
            
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(baseUrl+"users")
            .success(function(data) {
                defered.resolve(data);
                })
            .error(function(err) {
                defered.reject(err)
            });

            return promise;
            
            
        };
       
        
       
    }])

    
    /***********************************************************************/
    /*********************** AuthenticationService *************************/
    /***********************************************************************/
    .factory('authenticationFactory',['$resource','baseUrl','$state','$cookieStore', function($resource,baseUrl,$state,$cookieStore){
        
        var salida = {};
        
        /**
          * Almacena las cookies que indican que el usuario se ha autenticado
          */
        salida.authenticate = function (usuario) {
              
           $cookieStore.put('conectado',true);
           $cookieStore.put('usuario',usuario);
                 
        }; // autenticar
            
            
        salida.usuarioAutenticado = function() {
            
            if(!(sessionStorage && sessionStorage.getItem("user")!=undefined)){
                // Si el usuario no está autenticado, se hace 
                // una redirección a la pantalla de login
                $state.go('app.login');
                
            } else return true;
            
        };
                                      
        salida.logout = function() {
            
        }
                 
        return salida;        
    
    }]);


    

