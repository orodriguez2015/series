function I18NMessages() {
    console.log("locale: " + LOCALE)
  
    i18next.init({
        lng: LOCALE,
        resources: {
            en: {
              translation: {
                "key": "hello world"
              }
            },

            es: {
              translation: {
                "title": "Título",
                "description": "Descripción",
                "general"    : "Datos Generales",  
                "exito.alta.nota" : "Se ha dado de alta la nota en base de datos",
                "error.alta.nota" : "Se ha producido un error al dar de alta la nota en base de datos",
                "error.conexion.servidor" : "No se puede establecer conexión con el servidor",  
              }
            }  
        }
      
    }, (err, t) => {
      // initialized and ready to go!
      const hw = i18next.t('key'); // hw = 'hello world'
    });

    
    function getMessage(key) {
        return i18next.t(key);
    }
    
    console.log("general: " + i18next.t("general"));
};


/**
  * Devuelve la descripción correspondiente a una determinada etiqueta
  * de texto
  * @param key: Llave/Nombre de la etiqueta
  *
I18NMessages.prototype.getMessage = function (key) {
    console.log("getmessage key: " + key + ",valor: " + i18next.t(key));
    return i18next.t(key);
};
*/
