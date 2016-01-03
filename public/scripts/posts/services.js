'use strict';

angular.module('gestor')

    // Se define la constante baseUrl para usar en el servicio
    .constant("baseUrl","http://localhost:5000/")

    // Se inyecta $resource en lugar de $http y baseUrl para el servicio
    .service('postService',['$resource','$http','baseUrl', function($resource,$http,baseUrl) {

        // Se recuperan los posts del servidor
        this.getPosts = function(inicio,fin){
            return $resource(baseUrl+"posts/:id/:begin/:end",null,  {'update':{method:'PUT' },'delete':{method:'DELETE'},'save':{method:'POST'}});
        };
        
        
        // Se recupera el número de post a través de $http ya que $resource es
        // válido para API REST solo
        this.getNumTotalPosts = function() {
            return $http.get(baseUrl + "posts/num");
        };
        
        
    }])
