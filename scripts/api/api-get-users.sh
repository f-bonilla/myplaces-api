#!/bin/bash

source api-config.sh

# Acceder al valor de la variable
echo "La URL de la API es: $api_url/users"

# Usar la variable en una llamada cURL
## curl -X GET "$api_url/users" > users.json
### NOTE: esto no funcionara hasta que el controlador este acabado (list)
curl -X GET "$api_url/users"


## echo "Realizando solicitud GET"
## curl -X GET 'https://tu-aplicacion.com/api/ruta-protegida' \
## -H 'Authorization: Bearer tu-token-jwt'

## echo "Realizando solicitud POST"
## curl -X POST 'https://tu-aplicacion.com/api/otra-ruta' \
## -H 'Authorization: Bearer tu-token-jwt' \
## -d 'data=contenido_del_post_data'
