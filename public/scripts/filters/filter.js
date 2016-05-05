'use strict';

/**
  * Definición de diferentes filtros
  */
angular.module('gestor')

/**
  * Filtro que comprueba si un valor numérico puede ser interpretado como
  * un booleano. Si contiene un uno es true y si es un cero es un false
  * @param valor (Integer)
  * @return True si valor==1 y false en caso contrario
  */
.filter("esBooleano", function(){
  return function(valor) {
      if(valor){
          return true;
      } else {
        return false;
      }
  }
})


/**
  * Filtro que devuelve un mensaje a mostrar en función del valor del argumento
  * sobre el que se aplica el filtro. Si el parámetro toma el valor 1 devuelve un "Si" y
  * en caso contrario, devuelve un "No"
  * @param valor (Integer)
  * @return "Si" si valor==1 y "No" en caso contrario
  */
.filter("visualizado", function(){
  return function(valor) {
      if(valor==1){
          return "Si";
      } else {
        return "No";
      }
  }
})


//filtro para poner la primera letra en mayúscula
.filter("capitalize", function(){
    return function(text) {
        if(text != null){
            return text.substring(0,1).toUpperCase()+text.substring(1);
        }
    }
})

//filtro para poner todo el texto en mayúsculas
.filter("toUpper", function(){
    return function(text){
        if(text != null){
            return text.toUpperCase();
        }
    }
})

//filtro para poner puntos suspensivos a partir de x carácteres
.filter("maxLength", function(){
    return function(text,max){
        if(text != null){
            if(text.length > max){
                return text.substring(0,max) + "...";
            }
        }
    }
})
