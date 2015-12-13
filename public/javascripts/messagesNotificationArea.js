function MessagesArea() {
    $("#alert").hide();
};


/**
  * Muestra un mensaje de error en el área de mensajes. Tiene
  * que existir un div de id "alert" para que se pueda mostrar
  * el mensaje en la parte superior de la página que se está visualizando
  * @param msg: Mensaje a mostrar
  */
MessagesArea.prototype.showMessageError = function (msg) {
    try {
        $("#alert").html(msg);
        $("#alert").removeClass("alert alert-success");
        $("#alert").addClass("alert alert-warning");
        // Se muestra el div lentamente
        $("#alert").fadeIn("slow");    
        // Se oculta el div 
        $("#alert").fadeOut(5000);   
        
    } catch(Err) {
        // En caso de que no existe sólo se muestra un mensaje de error
        // por la consola
        console.error("Error al mostrar el área de mensajes " + Err);
    }
};

/**
  * Muestra un mensaje de éxito en el área de mensajes. Tiene
  * que existir un div de id "alert" para que se pueda mostrar
  * el mensaje en la parte superior de la página que se está visualizando
  * @param msg: Mensaje a mostrar
  */
MessagesArea.prototype.showMessageSuccess = function(msg) {
    try {
        $("#alert").html(msg);
        $("#alert").removeClass("alert alert-warning");
        $("#alert").addClass("alert alert-success");
        $("#alert").fadeIn("slow");    
        // Se oculta el div 
        $("#alert").fadeOut(5000);     
        
    }catch(Err) {
        // En caso de que no existe sólo se muestra un mensaje de error
        // por la consola
        console.error("Error al mostrar el área de mensajes " + Err);
    }  
};


/**
  * Oculta el área de mensajes
  */
MessagesArea.prototype.clearMessagesArea = function() {
  try {
      $('#alert').hide();
      
  } catch(Err) {
    console.error("Error al cerrar el área de mensajes: " + Err);   
  }
};
       