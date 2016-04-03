/**
  * Clase SessionStorage con operaciones que
  * permite almacenar o recuperar objetos del SessionStorage
  * del navegador
  */
function RecordingSessionStorage() {
};

/**
  * Almacena un objeto en el SessionStorage del navegador
  * @param name: Nombre con el que se almacenará el objeto
  * @param value: Objeto a almacenar
  */
RecordingSessionStorage.prototype.saveObject = function (name,value) {
    sessionStorage.setItem(name,JSON.stringify(value));
};


/**
  * Almacena un elemento de tipo String en el SessionStorage del navegador
  * @param name: Nombre con el que se almacenará el elemento
  * @param valor: Valor que toma el elemento
  */
RecordingSessionStorage.prototype.saveElement = function (name,value) {
    sessionStorage.setItem(name,value);
};


/**
  * Recupera un determinado objeto del sessionStorage del navegador
  * @param name: Nombre del objeto a recuperar
  */
RecordingSessionStorage.prototype.getObject = function (name) {
    var object = sessionStorage.getItem(name);
    var salida = null;
    if(object!=null && object!=undefined) {
       salida = JSON.parse(object);
    }
    return salida;
};


/**
  * Recupera el valor de una variable de tipo String almacenada en el SessionStorage del navegador
  * @param name: Nombre del elemento
  * @param value: Valor del elemento
  */
RecordingSessionStorage.prototype.getElement = function (name) {
    return sessionStorage.getItem(name);
};


/**
  * Elimina un determinado elemento almacenado en el SessionStorage
  * del navegador
  * @param name: Nombre del elemento
  */
RecordingSessionStorage.prototype.removeItem = function (name) {
    sessionStorage.removeItem(name);
};


// Instancia de la clase RecordingSessionStorage que se reutiliza
// en la aplicación
var recordingSessionStorage = new RecordingSessionStorage();
