# desarrollo local y conexion con el backend

## requisitos previos

- node.js (version compatible con NestJS 10+)
- pnpm como gestor de paquetes
- postgresql corriendo en localhost:5432
- base de datos `correos_db` creada

---

## variables de entorno

el backend requiere variables de entorno. los valores listados abajo deben leerse como ejemplos locales para esta repo, no como contrato universal para todos los entornos:

| variable | valor de desarrollo | descripcion |
|----------|--------------------|-------------|
| `DATABASE_URL` | `postgresql://admin:admin123@localhost:5432/correos_db?schema=public` | conexion a PostgreSQL |
| `PORT` | `3000` | puerto del servidor (default: 3000) |
| `STRIPE_SECRET_KEY` | `sk_test_...` | clave secreta de stripe (modo test) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | secreto para validar webhooks de stripe |
| `DEBUG` | `true` | activa logs de debug |

nota: el frontend no necesita estas variables directamente. son referencias para levantar este backend en local.

---

## levantar el backend

```bash
# instalar dependencias
pnpm install

# generar el cliente de prisma
pnpm prisma generate

# ejecutar migraciones
pnpm prisma migrate dev

# iniciar en modo desarrollo (hot-reload)
pnpm run start:dev
```

si no cambias `PORT`, el servidor queda disponible en `http://localhost:3000`. ese puerto no debe asumirse como fijo fuera del entorno local.

---

## endpoint GraphQL

| protocolo | URL | metodo |
|-----------|-----|--------|
| GraphQL | `http://localhost:3000/graphql` | POST |

nota importante: la URL anterior es el ejemplo local por defecto de esta repo. en otros entornos puede cambiar host, puerto o base path.

el playground clasico de Apollo esta **deshabilitado** (`playground: false`). ademas se registra `ApolloServerPluginLandingPageLocalDefault()`, por lo que en local puede existir una landing page web, pero para integracion conviene seguir usando introspection o codegen.

---

## como conectar el frontend

### configuracion basica de Apollo Client

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'Authorization': `Bearer ${getStoredToken()}`,  // token de sesion
    'X-Store-Id': getCurrentStoreId(),               // UUID de la tienda activa
  }
}));

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

usa esa `uri` solo como ejemplo local. en frontend real debe salir de configuracion por entorno.

### headers requeridos

| header | valor | cuando enviarlo |
|--------|-------|----------------|
| `Authorization` | `Bearer <session_token>` | en toda peticion autenticada |
| `X-Store-Id` | UUID de la tienda | en toda peticion que opera bajo contexto de tienda |
| `Content-Type` | `application/json` | siempre (Apollo lo agrega automatico) |

ver [02-store-context-and-multi-tenancy.md](02-store-context-and-multi-tenancy.md) para detalle de cuando omitir `X-Store-Id`.

---

## introspection del schema

dado que el playground esta deshabilitado, las opciones para explorar el schema son:

### opcion 1: leer el archivo schema.gql generado

el backend genera automaticamente `src/schema.gql`. sin embargo, en el estado actual este archivo puede estar incompleto (algunos tipos tienen `exampleField: Int!` como placeholder).

### opcion 2: usar un cliente externo con introspection

con herramientas como Insomnia, Postman o GraphQL Playground standalone:

```
POST http://localhost:3000/graphql
Content-Type: application/json

{
  "query": "{ __schema { types { name fields { name type { name kind ofType { name } } } } } }"
}
```

### opcion 3: codegen

si usas `graphql-codegen`, apuntalo al endpoint local:

```yaml
# codegen.yml
schema: http://localhost:3000/graphql
documents: "src/**/*.graphql"
generates:
  src/generated/graphql.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
```

---

## checklist de integracion local

antes de comenzar a desarrollar features del frontend, verifica lo siguiente:

- [ ] backend corriendo en `http://localhost:3000`
- [ ] puedes hacer una query basica sin auth: introspection query
- [ ] confirmaste en el entorno real cual es la ruta efectiva de sign-up/sign-in de better auth
- [ ] confirmaste como el entorno entrega la sesion al frontend despues de auth
- [ ] puedes hacer una query autenticada enviando `Authorization: Bearer <token>`
- [ ] puedes hacer una query con `X-Store-Id` que devuelva datos
- [ ] la query de `me` devuelve el usuario autenticado

### verificacion rapida con curl

```bash
# 1. confirmar ruta real de sign-up/sign-in de better auth en tu entorno
# 2. autenticarte por ese flujo y guardar la sesion resultante
# 3. query autenticada
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"query":"{ me { user { id email name } session { id expiresAt } } }"}'
```

si quieres probar las rutas REST locales confirmadas por codigo, puedes usar por ejemplo `GET /auth/validate` o `GET /auth/me` con un token ya obtenido.

---

## debugging comun

### "cannot POST /graphql"

- el servidor no esta corriendo. verificar con `pnpm run start:dev`.
- verificar que el puerto es correcto (default 3000).

### "missing X-Store-Id header"

- la mutation/query requiere contexto de tienda.
- agregar `X-Store-Id: <UUID>` en los headers.
- verificar que el UUID corresponda a una tienda existente.

### "UNAUTHENTICATED"

- el token no es valido o la sesion expiro.
- verificar que el header sea `Authorization: Bearer <token>` (no `token <token>`).

nota: en los archivos revisados no hay una duracion de sesion de better auth explicitamente configurada. el valor de expiracion debe verificarse contra el entorno real.

### "cannot reach server" / CORS

- el backend no configura CORS explicitamente en el codigo visible. si el frontend corre en otro puerto (ej: 5173 para vite), puede haber problemas de CORS.
- opciones: configurar CORS en el backend o usar un proxy en el dev server del frontend.

ambiguedad: no se encontro configuracion de CORS en el codigo. si el frontend corre en un dominio/puerto diferente, esto necesita ser resuelto.

### errores de prisma / base de datos

- verificar que postgresql este corriendo.
- verificar que las migraciones se hayan ejecutado (`pnpm prisma migrate dev`).
- verificar la variable `DATABASE_URL`.

`DATABASE_URL`, host, puerto, usuario, password y nombre de base deben tratarse como datos del entorno concreto, no como constantes del producto.

### datos de prueba

el repositorio incluye `scripts/create_test_db.sql` para base de datos de test. en `package.json` revisado no aparece un script de seed para desarrollo, asi que cualquier dataset inicial adicional queda fuera de contrato en estos archivos.

---

## estructura de archivos relevante para el frontend

| ruta backend | que contiene | relevancia para frontend |
|-------------|-------------|------------------------|
| `src/schema.gql` | schema GraphQL generado | referencia de tipos (puede estar incompleto) |
| `prisma/schema.prisma` | esquema de base de datos | entender la estructura de datos |
| `src/core/auth/` | autenticacion y sesion | endpoints REST de auth |
| `src/core/store/` | multi-tenancy | logica de X-Store-Id |
| `src/catalog/` | productos, variantes, taxonomias | queries de catalogo |
| `src/commercial-sales/` | ordenes, checkout, promociones | mutations de compra |
| `src/inventory/` | stock, disponibilidad | queries de disponibilidad |
| `src/fulfillment/` | envios, devoluciones | queries post-compra |
| `src/financial/payments/` | pagos, stripe | integracion de pagos |

---

## notas sobre el entorno

- el backend usa `ValidationPipe` global con `whitelist: true` y `transform: true`. esto significa que cualquier campo no declarado en el DTO sera eliminado silenciosamente.
- no se detectaron websockets ni subscriptions GraphQL en el codigo actual.
- no hay rate limiting configurado en el codigo visible.
- el formato de fechas es ISO 8601 (`DateTime` de GraphQL).
- los IDs son UUID v4 en formato string.
- los montos monetarios son `Float` (no centavos enteros) — consideracion importante para precision.
