# MiniBlog API - Desarrollo

La documentacion completa esta en [Documentacion/README.md](../Documentacion/README.md).

## Ejecutar en local

Requiere Node.js 22.9 o superior y PostgreSQL 14 o superior. Desde esta carpeta:

```bash
npm install
cp .env.example .env   # completa DATABASE_URL
npm run db:init        # BORRA y vuelve a crear las tablas, con datos de ejemplo
npm run dev
```

API en `http://localhost:3000` y Swagger UI en `http://localhost:3000/api-docs`.

## Tests

```bash
npm test
```

Los tests **borran los datos** de la base definida en `DATABASE_URL`: usa una base de pruebas.

## Desplegar en Railway

1. Crea un proyecto con un servicio PostgreSQL y otro desde este repositorio de GitHub.
2. En el servicio de la API, **Settings** > **Source** > **Root Directory**: `/Desarrollo`.
3. En **Variables**: `DATABASE_URL=${{Postgres.DATABASE_URL}}` (URL interna).
4. Crea las tablas desde tu computador con la URL publica de la base: `DATABASE_URL="<DATABASE_PUBLIC_URL>" npm run db:init`.
5. En **Settings** > **Networking**, pulsa **Generate Domain**.

Detalle, URLs y capturas en la [guia de despliegue](../Documentacion/README.md#despliegue-en-railway).
