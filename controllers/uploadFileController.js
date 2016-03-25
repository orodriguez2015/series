var salida = require('./salidaUtil.js');

/**
  * Función invocada cuando se pretende realizar un
  * upload de un archivo al servidor
  * @param req: Request
  * @param res: Response
  * @param next: Objeto next que permite pasar al siguiente middleware
  */
exports.uploadFile = function(req,res,next) {

  var formidable = require('formidable');
  var http = require('http');
  var util = require('util');
  var fs   = require('fs-extra');


  var form = new formidable.IncomingForm();
      // Método que es ejecutado para devolver la respuesta al usuario, una vez
      // recibida la petición POST
      form.parse(req, function(err, fields, files) {

        var respuesta = {
          status: 0
        };

        salida.devolverJSON(res,respuesta);
        /**
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
        **/
  });

  // Función que procesa el archivo
  form.on('end', function(fields, files) {



     if(!(this.openedFiles.length==1)) {
        // Sino se ha enviado un archivo, se devuelve Error
        var resultado = {
          status: 2
        };
        salida.devolverJSON(res,resultado);
        
     } else {

        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location = 'upload/';

        console.log("uploadArchivo temp_path: " + temp_path);
        console.log("uploadArchivo fileName: " + file_name);
        console.log("uploadArchivo newLocation: " + new_location);


        // Se copia el archivo subido al servidor de la ubicación temporal, a su ubicación
        // definitiva
        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.error("Error al copiar el fichero del diretorio temporal al definitivo: " + err);
                var respuesta = {
                  status:1
                };
                salida.devolverJSON(res,respuesta);

            } else {
                console.log("Archivo copiado al directorio de upload");
            }
        });
      }// else
   });

};
