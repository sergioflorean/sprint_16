# Notes API

La API de notas con su front end. La autenticación y la autorización ya están implementadas: este proyecto es el punto de partida del capítulo sobre seguridad del back end y despliegue.

## Requisitos

- Node.js 20 o superior
- MongoDB corriendo en tu máquina

## Puesta en marcha

1. Haz un fork de este repositorio y clónalo.

2. Instala las dependencias de las dos partes con un solo comando, desde la raíz:

   ```bash
   npm run install:all
   ```

3. Copia el archivo de ejemplo con las variables de entorno del servidor:

   ```bash
   cp server/.env.example server/.env
   ```

4. Abre `server/.env` y reemplaza `JWT_SECRET` por un valor propio. Genéralo así y pega el resultado en el archivo:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
   ```

5. Arranca el back end en una terminal:

   ```bash
   npm run dev:server
   ```

   Tienes que ver estas dos líneas:

   ```
   Conectado a MongoDB
   Servidor ejecutándose en el puerto 3000
   ```

6. Arranca el front end en otra terminal:

   ```bash
   npm run dev:client
   ```

   Se abre en `http://localhost:5173`. Si Vite toma otro puerto, ajusta `CLIENT_ORIGIN` en `server/.env` para que coincida; si no, el navegador va a bloquear las peticiones.

## Pruebas de las lecciones

Cada lección trae su propia prueba. Ejecútalas desde la raíz, con el servidor en ejecución y desde una terminal libre:

```bash
npm run test:02
npm run test:03
npm run test:04
```

La prueba de la lección 5 corre contra tu aplicación ya desplegada, así que recibe la dirección de tu API como argumento:

```bash
npm run test:05 -- https://tu-api.vercel.app
```

## Estructura

```
client/    front end de React con Vite
server/    API de Express con TypeScript y Mongoose
tests/     pruebas de verificación de cada lección
```

## API

| Método | Ruta | Requiere token | Descripción |
|--------|------|----------------|-------------|
| `POST` | `/auth/register` | No | Crea una cuenta |
| `POST` | `/auth/login` | No | Inicia sesión y devuelve un token |
| `GET` | `/auth/me` | Sí | Devuelve los datos de la cuenta actual |
| `GET` | `/notes` | Sí | Lista tus notas, de la más reciente a la más antigua |
| `POST` | `/notes` | Sí | Crea una nota a tu nombre |
| `DELETE` | `/notes/:id` | Sí | Borra una nota tuya; una ajena responde 403 |

Todas las respuestas tienen la misma forma:

```json
{ "success": true, "data": {}, "error": null }
```
