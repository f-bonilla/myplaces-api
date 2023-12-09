#!/bin/bash

# Ejecutar el script de generación de constantes, este planteamineto no seria el correcto
# lo suyo es que webpack al generar la build cree este fichero y los que hagan falta
node ./scripts/api/api-get-user-roles.js

# Verificar si el script de generación de constantes se ejecutó con éxito
if [ $? -eq 0 ]; then
  nodemon ./src/server.js
else
  echo "El script de generación de constantes falló. No se puede iniciar el servidor."
fi