# MiniBlog API

API REST para gestionar **authors** (usuarios), **posts** (publicaciones) y **comments** (comentarios, extra credit) de MiniBlog, el servicio de contenidos de DevSpark. Proyecto Integrador del modulo 2 (Full Stack, Henry).

- **Stack:** Node.js + Express 5, PostgreSQL con `pg` (consultas SQL directas y parametrizadas), Vitest + Supertest para los tests, OpenAPI 3 con Swagger UI.
- **Documentacion interactiva:** `/api-docs` (Swagger UI) y el archivo [`openapi.yaml`](./openapi.yaml).
- **API desplegada:** `https://proyectom2juan-mateo-rico-rojas-production.up.railway.app`  (documentacion en `https://proyectom2juan-mateo-rico-rojas-production.up.railway.app/api-docs`)

## Contenido

1. [Modelo de datos](#modelo-de-datos)
2. [Endpoints](#endpoints)
3. [Validaciones y codigos HTTP](#validaciones-y-codigos-http)
4. [Requisitos](#requisitos)
5. [Ejecutar en local](#ejecutar-en-local)
6. [Tests](#tests)
7. [Documentacion OpenAPI](#documentacion-openapi)
8. [Despliegue en Railway](#despliegue-en-railway)
9. [Estructura del proyecto](#estructura-del-proyecto)
10. [Registro del uso de IA](#registro-del-uso-de-ia)

## Modelo de datos

```
authors (id, name, email UNIQUE, bio, created_at)
   |
   | 1 --- N
   v
posts (id, title, content, author_id FK, published, created_at)
   |
   | 1 --- N
   v
comments (id, content, author_id FK, post_id FK, created_at)
```

- Las llaves foraneas usan `ON DELETE CASCADE`: borrar un autor borra sus posts y comentarios, y borrar un post borra sus comentarios.
- `posts.published` es `BOOLEAN NOT NULL DEFAULT TRUE`.
- Indices basicos sobre las llaves foraneas (`posts.author_id`, `comments.author_id`, `comments.post_id`). `PRIMARY KEY` y `authors.email` ya generan su propio indice.
- Los scripts estan en [`db/schema.sql`](./db/schema.sql) (tablas e indices) y [`db/seed.sql`](./db/seed.sql) (datos de ejemplo).

## Endpoints

`GET /` devuelve la informacion de la API (nombre, version, lista de endpoints) y el enlace a la documentacion (`/api-docs`).

### Authors

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/authors` | Lista autores. Filtros opcionales: `?name=` (parcial, sin distinguir mayusculas) y `?email=` (exacto) |
| GET | `/authors/:id` | Detalle de un autor |
| GET | `/authors/:id/posts` | Autor con la lista de sus posts |
| POST | `/authors` | Crea un autor (`name`, `email` obligatorios; `bio` opcional) |
| PUT | `/authors/:id` | Reemplaza un autor |
| PATCH | `/authors/:id` | Actualiza solo los campos enviados |
| DELETE | `/authors/:id` | Elimina el autor (y sus posts y comentarios) |

### Posts

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/posts` | Lista posts. Filtros: `?title=` (parcial), `?published=true\|false`, `?author_id=` |
| GET | `/posts/:id` | Detalle de un post |
| GET | `/posts/:id/author` | Post con el nombre y el email de su autor |
| GET | `/posts/author/:authorId` | Posts de un autor, con el detalle del autor |
| POST | `/posts` | Crea un post (`title`, `content`, `author_id` obligatorios; `published` opcional, por defecto `true`) |
| PUT | `/posts/:id` | Reemplaza un post |
| PATCH | `/posts/:id` | Actualiza solo los campos enviados |
| DELETE | `/posts/:id` | Elimina el post (y sus comentarios) |

### Comments (extra credit)

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/comments` | Lista comentarios. Filtros: `?author_id=`, `?post_id=` |
| GET | `/comments/:id` | Detalle de un comentario |
| GET | `/comments/:id/author` | Comentario con el nombre y el email de su autor |
| GET | `/comments/:id/post` | Comentario con el titulo de su post |
| POST | `/comments` | Crea un comentario (`content`, `author_id`, `post_id`) |
| PUT | `/comments/:id` | Reemplaza un comentario |
| PATCH | `/comments/:id` | Actualiza solo los campos enviados |
| DELETE | `/comments/:id` | Elimina el comentario |

Ejemplo:

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi primer post", "content": "Hola mundo", "author_id": 1}'
```

## Validaciones y codigos HTTP

| Codigo | Cuando |
|---|---|
| 200 | Lectura, actualizacion o borrado correctos (el `DELETE` devuelve el recurso eliminado) |
| 201 | Recurso creado |
| 400 | Datos invalidos: campo obligatorio vacio o ausente, tipo incorrecto, email sin formato, id que no es un entero positivo, `author_id` o `post_id` inexistente, JSON mal formado |
| 404 | El recurso no existe, o la ruta no existe |
| 409 | El email del autor ya existe |
| 500 | Error inesperado del servidor |

Todos los errores tienen el mismo formato: `{ "error": "mensaje" }`. Los errores de la base de datos (llaves foraneas, email unico) se traducen a respuestas HTTP en [`utils/pgErrors.js`](./utils/pgErrors.js) y [`errors/errorHandler.js`](./errors/errorHandler.js).

## Requisitos

- Node.js **22.9 o superior**
- PostgreSQL 14 o superior (local) o una base en Railway
- npm

## Ejecutar en local

1. **Clonar e instalar dependencias**

   ```bash
   git clone https://github.com/JRicoRojas/ProyectoM2_Juan-Mateo-Rico-Rojas.git
   cd ProyectoM2_Juan-Mateo-Rico-Rojas
   npm install
   ```

2. **Crear una base de datos vacia** en tu PostgreSQL local (por ejemplo `miniblog`):

   ```bash
   createdb miniblog
   ```

3. **Configurar las variables de entorno.** Copia el ejemplo y completa tus datos:

   ```bash
   cp .env.example .env
   ```

   | Variable | Descripcion | Ejemplo |
   |---|---|---|
   | `DATABASE_URL` | Cadena de conexion a PostgreSQL (obligatoria) | `postgresql://usuario:password@localhost:5432/miniblog` |
   | `PORT` | Puerto del servidor (opcional) | `3000` |
   | `DB_SSL` | `true` solo si la base exige SSL | `false` |

   El archivo `.env` no se sube a GitHub: solo `.env.example`.

4. **Crear las tablas y cargar los datos de ejemplo:**

   ```bash
   npm run db:init
   ```

   > **Atencion:** `schema.sql` borra las tablas existentes (`DROP TABLE`) antes de crearlas y `seed.sql` vacia las tablas. No lo ejecutes contra una base con datos que quieras conservar. Para crear solo las tablas, sin datos de ejemplo: `npm run db:schema`.

5. **Iniciar el servidor:**

   ```bash
   npm run dev      # recarga automatica y carga .env
   ```

   La API queda en `http://localhost:3000` y la documentacion en `http://localhost:3000/api-docs`.

### Scripts

| Comando | Que hace |
|---|---|
| `npm run dev` | Servidor con recarga automatica, carga `.env` |
| `npm start` | Servidor de produccion (las variables vienen del entorno, como en Railway) |
| `npm test` | Ejecuta todos los tests una vez |
| `npm run test:watch` | Tests en modo observador |
| `npm run test:coverage` | Tests con cobertura (requiere `@vitest/coverage-v8`) |
| `npm run db:init` | Crea tablas e indices y carga los datos de ejemplo |
| `npm run db:schema` | Crea solo tablas e indices |

## Tests

```bash
npm test
```

- **Validadores y errorHandler** (`test/validator.test.js`, `test/errorHandler.test.js`): tests unitarios que llaman a las funciones con `req`, `res` y `next` simulados.
- **Endpoints** (`test/authors.test.js`, `test/posts.test.js`, `test/comments.test.js`): tests con Supertest sobre toda la app (rutas, validadores, SQL y manejo de errores).

Los tests de endpoints usan la **base real definida en `DATABASE_URL`** y ejecutan `db/seed.sql` antes de cada grupo, asi que **borran los datos de esa base**. Usa una base de pruebas, nunca una con datos que quieras conservar. Los archivos de test se ejecutan uno a uno (`fileParallelism: false` en `vitest.config.mjs`) porque comparten la misma base.

## Documentacion OpenAPI

La especificacion esta en [`openapi.yaml`](./openapi.yaml) (OpenAPI 3.0.3) y se sirve con Swagger UI:

- Local: `http://localhost:3000/api-docs`
- Desplegada: `https://proyectom2juan-mateo-rico-rojas-production.up.railway.app/api-docs`

Tambien puedes abrir el archivo en [editor.swagger.io](https://editor.swagger.io) o importarlo en Postman.

## Despliegue en Railway

1. **Subir el codigo a GitHub** (sin `.env`; esta en `.gitignore`).
2. En [railway.com](https://railway.com) crea un **proyecto nuevo** y agrega un servicio **PostgreSQL** (`New` > `Database` > `Add PostgreSQL`).
3. Agrega otro servicio **desde el repositorio de GitHub** (`New` > `GitHub Repo`). Railway detecta Node.js, ejecuta `npm install` y arranca con `npm start`.
4. En el servicio de la API, pestana **Variables**, agrega:

   | Variable | Valor |
   |---|---|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (referencia al servicio de base de datos; usa la URL **interna**) |

   `PORT` lo define Railway automaticamente y la app ya lo lee (`process.env.PORT`). `DB_SSL` no hace falta dentro de Railway.
5. **Crear las tablas en la base de Railway.** La base nace vacia. Desde tu computador, con la **URL publica** de la base (variable `DATABASE_PUBLIC_URL` del servicio PostgreSQL):

   ```bash
   DATABASE_URL="<DATABASE_PUBLIC_URL>" npm run db:init
   ```

   Si la conexion exige SSL, agrega `DB_SSL=true`. Tambien puedes usar la CLI de Railway (`railway run npm run db:init`).
6. En el servicio de la API, pestana **Settings** > **Networking**, pulsa **Generate Domain** para obtener la URL publica.
7. Verifica: abre `https://proyectom2juan-mateo-rico-rojas-production.up.railway.app/api-docs` y prueba `GET https://proyectom2juan-mateo-rico-rojas-production.up.railway.app/authors`.

| | URL |
|---|---|
| **URL publica de la API** | `https://proyectom2juan-mateo-rico-rojas-production.up.railway.app` |
| **URL interna de la API** (solo accesible entre servicios del proyecto en Railway) | `http://proyectom2juan-mateo-rico-rojas.railway.internal:8080` |
| **URL interna de la base de datos** (solo accesible entre servicios del proyecto en Railway) | `postgres.railway.internal:5432` |
| **Documentacion** | `https://proyectom2juan-mateo-rico-rojas-production.up.railway.app/api-docs` |

La API se conecta a la base de datos por la **URL interna** (`postgres.railway.internal`), a traves de la variable `DATABASE_URL` que referencia al servicio PostgreSQL. La base tambien tiene un dominio publico (proxy TCP) que se usa solo para ejecutar `npm run db:init` desde un computador.

### Capturas del despliegue

**1. Despliegue activo y exitoso** (pestana **Deployments** del servicio de la API, Node 22, 1 replica):

![Despliegue activo de la API en Railway](./docs/railway-deployment.png)

**2. Red del servicio de la API** (**Settings** > **Networking**): dominio publico, puerto `8080` y URL interna `proyectom2juan-mateo-rico-rojas.railway.internal`:

![Red publica y privada del servicio de la API en Railway](./docs/railway-api-networking.png)

**3. Red del servicio PostgreSQL** (**Settings** > **Networking**): red publica (proxy TCP) y URL interna `postgres.railway.internal`:

![Redes publica y privada del servicio PostgreSQL en Railway](./docs/railway-postgres-networking.png)

Cada `push` a la rama principal despliega automaticamente la nueva version.

## Estructura del proyecto

```
.
|-- app.js               # Configura Express: rutas, /api-docs, 404 y errorHandler
|-- server.js            # Arranque del servidor (listen)
|-- openapi.yaml         # Especificacion OpenAPI
|-- db/
|   |-- config.js        # Pool de conexiones a PostgreSQL (DATABASE_URL)
|   |-- schema.sql       # Tablas, llaves foraneas e indices
|   |-- seed.sql         # Datos de ejemplo
|   |-- init.js          # npm run db:init
|   `-- runSeed.js       # Ejecuta seed.sql (lo usan los tests)
|-- models/              # Consultas SQL parametrizadas (authors, posts, comments)
|-- routes/              # Endpoints de Express
|-- errors/              # Errores HTTP, validadores y errorHandler
|-- utils/pgErrors.js    # Traduce errores de PostgreSQL a respuestas HTTP
`-- test/                # Tests unitarios y de endpoints
```

## Registro del uso de IA

Herramienta: **Claude Code** (asistente de IA de Anthropic) dentro de VS Code, en modo conversacional. Lo use sobre todo para **revisar mi codigo, entender conceptos y escribir tests**. La arquitectura, el esquema SQL, los modelos, las rutas y los validadores los escribi yo; la IA propuso correcciones que yo revise y acepte o descarte.

### Para que la use

| Tarea | Quien la hizo | Detalle |
|---|---|---|
| Arquitectura (rutas, modelos, validadores, errorHandler), esquema SQL y seed | Yo | La IA solo respondio dudas de diseno (por ejemplo `throw` vs `return` en validadores, que status usar para una llave foranea inexistente) |
| Explicacion de conceptos | IA | Mocks (`vi.fn`), `beforeAll`/`beforeEach`, `JOIN`, matchers de Vitest, orden de middlewares en Express, diferencia entre test unitario y de integracion |
| Revision de codigo y deteccion de errores | IA, yo corregi | Ver tabla de errores mas abajo |
| Tests de validadores, errorHandler y endpoints de authors | Yo con ayuda | Escribi los primeros; la IA reviso que casos faltaban |
| Tests de posts y comments, y casos adicionales de validadores | IA | Los escribio la IA a partir de mis rutas y el seed; yo los ejecute y revise |
| Refactor de validadores (`validatePositiveInt`, validadores de query params) | IA | Propuesto por la IA y aplicado en la sesion |
| Ruta de inicio `GET /` | Yo (borrador) + IA | Yo escribi el borrador de la ruta; la IA corrigio las rutas que listaba y escribio su test (`test/root.test.js`) |
| Preparacion para Railway (`start`, `db/init.js`, `DATABASE_URL`, indices, `.env.example`) y este README | IA, yo revise | |
| Diagnostico del despliegue en Railway | IA, yo aplique | Con los logs que le pegue, la IA identifico que faltaba la variable `DATABASE_URL` en el servicio de la API; yo la configure en Railway |
| `openapi.yaml` | Yo (base) + IA (detalles) | Yo escribi la base del archivo (rutas, metodos y esquemas). La IA agrego detalles y ajustes, por ejemplo los ejemplos de respuesta del error 404 para authors, posts y comments |

### Errores que la IA encontro en mi codigo y yo corregi

| Error | Efecto |
|---|---|
| Un middleware (`validatePostsBody`) no llamaba a `next()` | La peticion se quedaba colgada |
| Filtro `name` con dos `push` y un `$` de mas en el `ILIKE` | Error de Postgres: "bind entrega 2 parametros" |
| `updatePost` asignaba `published` dos veces y nunca actualizaba `author_id` | El `PATCH` de posts fallaba y pisaba valores |
| Filtros de `posts` y `comments` envolvian enteros con `%` y el de `post_id` usaba la columna `author_id` | Errores 500 o resultados incorrectos |
| `createPost` insertaba `published = NULL` cuando no venia | Guardaba `null` en vez de usar el valor por defecto |
| Las rutas de comments leian `comment` en vez de `content` | Error 500 al crear |
| Nombre de constraint mal escrito en `pgErrors` (`comments_posts_id_fkey`) | Un `post_id` inexistente daba 500 en vez de 400 |
| `errorHandler` ignoraba `err.status` | Un JSON mal formado respondia 500 en vez de 400 |
| `validateEmail` aceptaba un arreglo con forma de email | Pasaba la validacion en el body y en el query |
| Script `start` invalido (`npm server.js`) y dependencias `install` y `npm` instaladas por error | Fallaria el despliegue |
| La ruta de inicio `GET /` listaba `/api/authors` y `/api/posts`, que no existen, y no incluia `/comments` | Los enlaces del inicio daban 404 |

### Como verifique lo que propuso la IA

- Ejecute los tests despues de cada cambio (`npm test`). Varios errores de arriba los encontro un test que fallaba.
- Revise cada cambio antes de aceptarlo y comprobe contra mi base que los nombres de constraints y los datos coincidieran.
- Rechace o ajuste sugerencias: por ejemplo, mantuve `throw` en los validadores en lugar de `return`, y deje `authors` como nombre de la entidad porque asi lo pide la consigna.

### Ejemplos de prompts

- "Checa si asi esta bien" (con el test seleccionado en el editor)
- "Porque no funciona?" (con el error pegado)
- "Puedes ver si me falta algo en validators.test de los validators"
- "Ayudame a crear test para este" (con el errorHandler seleccionado)
- "Checa nuevamente por fa ya los agregue yo"
- "Que falta para el proyecto nuevamente?"

### Limitaciones y reflexion

- La IA cometio errores de interpretacion que tuve que corregir (por ejemplo, confundir el nombre de un parametro o proponer mas pruebas de las necesarias). Por eso valide todo contra los tests y la base real.
- Aprendi sobre todo a **probar a distintos niveles** (unitario vs. endpoint), a **no confiar en el `DEFAULT` de SQL** cuando se envia `NULL`, y a **manejar errores de la base** de forma central.
- Si repitiera el proyecto, escribiria los tests de cada endpoint junto con la ruta, no despues.
