# MyPlaces API RESTful

This is a API RESTful built with Node.js and Express that allows users to perform CRUD operations on a MongoDB database using Mongoose for object modeling.

# TODO:

- falta que cuando este en produccion envie el correo de verdad
  ver si hay algo en los ficheros .env

<API>
- documentar que los datos para options, option-types, etc...se tiene que encargar el front de recuperarlos y usarlos a su antojo
  esto es por no hacer peticiones, guardar el json directamente, esto lo suyo seria en el proceso de despliegue
- ver languages por si acaso y borrar, la api no se cambia de idioma, simplemente proporciona la posibilidad de ejecutarla en otros idiomas
- cambiar response-handler por additionalDataHandler
- ver si se puede enviar login especificando un user...
- seguridad
  - XSS
    `function hasXssPayload(value) {
    // Define patrones regulares que coincidan con posibles ataques XSS
    const xssPatterns = [
      /<script\b[^>]*>.*?<\/script>/i, // Etiquetas <script>...</script>
      /on\w+\s*=/i, // Atributos de eventos como onmouseover=
      /javascript\s*:/i, // Protocolo JavaScript en atributos
      /data:\s*text\/html/i, // Manipulación de contenido MIME
    ];

    // Comprueba si alguno de los patrones coincide con el valor
    for (const pattern of xssPatterns) {
      if (pattern.test(value)) {
        return true; // Se ha encontrado un posible ataque XSS
      }
    }

    return false; // No se encontraron ataques XSS

    }

    // luego en los controladores
    const create = async (req, res, next) => {
    try {
    for (const value of req.body) {
    if (hasXssPayload(value)) {
    // "Possible XSS attack detected"
    }
    }
    } catch (err) {
    next(err);
    }
    };`

- documentacion
  JSDoc es lo mas sencillo, se basa en los comentarios
- reflexionar sobre la necesidad de exportar .api y .routes, es uso interno y paths, pero se esta realmente usando lo suficiente como
  para tenerlo diferenciado asi?
- seguramente haga falta un script para que genere ACL.json
  aqui habra que estudiar como se deja esto...ya hay uno funcionando que crea las constantes
- en app.use cors, añadir las urls de confianza en los ficheros env, de momento esta es la de pruebas
  serve C:\Users\ardle\Documents\MEGA\work\hosting\boniland.es-netlify.com\ -l 64053
  posteriormente tendra que ser la url de produccion claro
- ponerlo a funcionar en un contenedor docker, igualmente para el front.
  llegados a este punto el build tiene que generar el archivo de constantes...
- usar webpack para añadir el id y mensaje del ultimo commit a la build
- cuando se cree el repositorio en github y antes de hacer nada mirar .git/config por si interesa guardar algo
  revisar todo, notes, todo, console...comentarios, etc...
- Subida de Archivos Maliciosos, a tener en cuenta, esto hasta que no se decida en el front como se va a hacer queda en espera

<FRONT>
  
- ver tambien un detalle de la localidad? informacion relevante de la localidad independientemente de los sitios que sepuedan añadir luego
  tambien con las provincias?
  esto mola, crea un catalogo mas completo asi no habria que añadir una localidad que nos interese como sitio, solo añadir la informacion
  necesaria en esa localidad, esto hay que pensarlo...  
- lo ultimo seria probar ataques de inyeccion
  Al mostrar datos en la interfaz de usuario, asegurarse de escapar cualquier contenido HTML para que no se interprete como código
- a la hora de buscar un sitio por nombre (futuras versiones)
  usar esto:
  `const collationOptions = { locale: i18n.getLocale(), strength: 2 };
    const { name } = req.body;
    const similarPlaces = await PlaceModel.find(
      { name: name },
      collationOptions
    );
  con esto por ejemplo al escribir: el gra
  nos podria dar como resultados:
    El Granero
    el granero
    El GraNero  
    `

- geolocalizacion:
  navigator.geolocation.getCurrentPosition(function(position) {
  // La posición del dispositivo
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var map = new google.maps.Map(document.getElementById("map"));
  var marker = new google.maps.Marker({
  position: {lat: latitude, lng: longitude},
  map: map
  });
  });
  // relaciona latitud/longitud con provincia/localidad
  var latitude = 40.4167;
  var longitude = -3.6833;
  // Geocodifica la ubicación
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({lat: latitude, lng: longitude}, function(results, status) {
  // La dirección geocodificada
  var address = results[0].formatted_address;
  // La localidad española
  var locality = address.split(", ")[0];
  // El código postal geocodificado
  var postalCode = results[0].postal_code;
  // Obtén el nombre de la localidad
  var localityName = locality;
  if (postalCode.startsWith("288")) {
  localityName = "Madrid";
  } else {
  localityName = locality.split(", ")[1];
  }
  // Obtén la provincia
  var province = localityName.split(" ")[0];
  // Imprime la localidad, la provincia y la localidad concreta
  console.log(localityName, province, locality);
  });
- imagenes ia para imagen por defecto segun la categoria
- todos los sitios en activo mas de x tiempo se guardan?
  por tener un listado de sitios que posiblemente sean reales
- podemos votar los sitios como negativo, esto esto es algo a titulo personal, un sitio por lo
  que sea no nos gusta mola que quede eso registrado de algun modo, para que por ejemplo no
  salga mas en el listado de sitios a no visitar, esto se podria derivar a otra url del tipo:
  boniland.es/places/puaj
  donde se vea el porque, si alguien quiere rebatir que añada su propia experiencia
  Una posibilidad es el boton "ocultar", al pulsar este se añade una descripcion de porque
  ocultarlo, ya no saldria mas en nuestra lista de places, ademas hay una url publica donde
  se ven todos los ocultados y el motivo...
  O tomarlo como una agenda personal y no se nada a conocer, esto tiene su lado negativo claro...
  Otra opcion, cuando se visita y se pulsa visitado marcar una puntuacion, esta puede ser la "solucion"
  cuando se llega a un sitio no visitado, al pulsar visitado hay que puntuar:
  0 - no nos gusto, mala experiencia, lo que sea...
  1/5 - nos gusto a su nivel
  en ambos casos comentario descriptivo para explicar el porque.
  ...
- privado/publico, en la lista las que sean nuestros se tendrian que distinguir
- redirigir:
  /places/la-paramera
  a:
  /places/madrid/alcorcon/tomar-algo/bar-restaurante/la-paramera
- puedes añadir un sitio de alguien a tu lista
- las url se comparten asi:
  https://midominio.com/places/el-establecimiento
  de tal manera que si el-establecimiento existe luego se convierte en:
  https://midominio.com/places/provincia/localidad/donde-comer/el-establecimiento
  y que cojones pasa si hay varios establecimientos con el mismo nombre???
  se muestra un listado de los que han aparecido para seleccionar uno??, segun la IA es una buena opcion
  ademas hay que tener en cuenta esto:
  Si la estructura de URL corta y amigable, como "midominio.com/places/un-lugar," se mantendrá de manera permanente y no cambiará en el futuro, entonces la redirección 301 (Movido permanentemente) sería la opción más adecuada. Esto indica a los motores de búsqueda que la URL ha cambiado permanentemente, y los motores de búsqueda transferirán la autoridad de búsqueda y las clasificaciones de página a la nueva URL.
  Entonces, en tu caso, puedes utilizar una redirección 301 para indicar que la URL corta y amigable es una característica permanente y que los usuarios deben ser redirigidos a la versión completa y descriptiva, al tiempo que consolidas la autoridad de búsqueda en la nueva URL. Esto es apropiado si la estructura de URL corta y amigable, como "midominio.com/places/un-lugar," no cambiará en el futuro y será una característica constante de tu sitio web.
- hara falta en el front lo mismo/seguramente un menu para ver los sitios:
  mios - todos - mas votados
- si a un usuario le caduca el token no podria acceder al listado /places/mine
  // en el sitio indicar el usuario que lo subio?
- los lugares borrados a la papelera, no se eliminar permanentemente...habria que revisar, etc...
- estudiar como trabajar bien con fuentes en porcentaje adaptables a cualquier pantalla
- probar esto, solo deberia cargar las imagenes cuando estan en pantalla:
  <img src="image.jpg" alt="..." loading="lazy" />
- ver esta pagina del gobierno parece un listado de todos los establecimientos de españa?
  a julio de 2023 los datos estan actualizados, parece fiable: https://datos.gob.es/es/catalogo/l01061535-bares-y-restaurantes
- añadir nuestro sistema de anuncios?? :-|
- hecho por y para usuarios, venazo marketinero

# NOTES

# QUESTIONS
