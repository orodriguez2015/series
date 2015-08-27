<!-- Se hace uso de la librería jQuery Validate para validar formularios -->
$("#formEditUsuario").validate({
    rules: {
      nombre: {
        required: true,
        minlength: 2,
        maxlength: 100
      },
      apellido1: {
        required: true,
        minlength: 2,
        maxlength: 100
      },
      apellido2: {
        required: true,
        minlength: 0,
        maxlength: 100
      },

      email: {
        required: true,
        email: true
      },
      
      login: {
        required: true,
        minlength: 4,
        maxlength: 10
      },
      
      password: {
        required: true,
        minlength: 4,
        maxlength: 10
      }
    },

    messages: {
      nombre: {
        lettersonly: "Escribe sólo letras"
      },

      apellidos: {
        lettersonly: "Escribe sólo letras"
      },
      email: {
        remote: "Email ya está en uso."
      },
      iban: {
        iban: "Introduzca un IBAN correcto (Para España 24 caracteres y empezando por ES)."
      }
    },

    // Si la validación es correcta, se añade la clase css 'has-success' de bootstrap,
    // al campo de formulario validado
    success: function(element) {
            $(element).closest('.form-group').addClass('has-success');
    },


    // Si la validación no es correcta, se añade la clase css 'has-error' de bootstrap,
    // al campo de formulario validado
    highlight: function(element) {
            $(element).closest('.form-group').addClass('has-error');
    },
    
    // Si la validación no es correcta, se añade la clase css 'has-error' de bootstrap,
    // al campo de formulario validado
    unhighlight: function(element) {
            $(element).closest('.form-group').removeClass('has-error');
    },

    errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            if(element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
    },

    submitHandler: function(form) {
 
      comprobarExistenciaUsuario(form);
    }
  });
    

    
  function mostrarMensajeError(errores) {
    var mensaje ="";
    var _cabecera = "<h4>Error</h4>";
    var _cuerpo = "<p>";

    for(var i=0;errores!=undefined && i<errores.length;i++) {
      _cuerpo += errores[i];
      if(errores.length-i>1) _cuerpo += "</br>"

    }
    _cuerpo += "</p>"

    $('#msgError').css('display', 'block');
    $('#msgError').html(_cabecera + _cuerpo);
        
  }

   

  /**
    * Función que realiza una llamada AJAX al servidor, para comprobar si ya existe un 
    * usuario con el login o con el email indicado */
  function comprobarExistenciaUsuario(form) {
      var exito = 0;
    
      var ajax_params = {
        "login"  : $('#login').val(),
        "email"  : $('#email').val(),
        "id" : $('#id').val()  
      }; 

     
     $.ajax({
       url: '/users/existeLoginEmailOtroUsuario',
       data: ajax_params,
       type: "POST",
       success: verificarRespuesta,
       error:function (xhr, ajaxOptions, thrownError) {
         exito = true;
         alert("Se ha producido un error al verificar la existencia del usuario: " + thrownError.message);

         return exito;
      }
     });

  }


  function verificarRespuesta(json){
    var exito = 0;
    try{
         

       if(json!=null) { 
           
          switch(Number(json.status)) { 
              case 0: 
                      enviarFormulario();
                      break;
                  
              case -1: // Error técnico al validar login e email en el servidor
                      var errores = new Array();
                      errores.push("Se ha producido un error técnico al validar el login del usuario");       
                      mostrarMensajeError(errores);
                      break;

              case 1: // Ya existe el login en BD
                      var errores = new Array();
                      errores.push("Ya existe otro usuario del sistema con el login indicado");  
                       
                      mostrarMensajeError(errores);
                      break;
                  
              case 2: // Ya existe el email en BD
                      var errores = new Array();
                      errores.push("Ya existe otro usuario del sistema con el email indicado");  
                       
                      mostrarMensajeError(errores);
                      break;          

          }// switch

       }else
          alert("Respuesta incorrecta");

    }catch(err){
      alert("Error al recuperar el json: " + err.message);
    } 

  }
    
    
