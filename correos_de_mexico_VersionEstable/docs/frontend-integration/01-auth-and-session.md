# autenticacion y sesion

## sistema de autenticacion

el backend usa **better auth** (`@thallesp/nestjs-better-auth`) como proveedor de autenticacion. las sesiones se almacenan en PostgreSQL a traves de prisma. el plugin `admin` esta activo con rol por defecto `user`.

---

## como autenticarse

### registro e inicio de sesion

better auth expone el flujo de sign-up y sign-in fuera de GraphQL. esos handlers no estan redefinidos manualmente en este repo.

lo que si puede afirmarse desde el codigo es:

- **confirmado**: existe un controller local REST bajo `/auth/*` para consultar sesion, validar token, listar sesiones y cerrar sesion
- **no confirmado como contrato definitivo desde este repo**: la ruta exacta donde better auth publica sign-up y sign-in

el repositorio usa `BetterAuthModule.forRoot({ auth })`, pero no declara explicitamente aqui la base de rutas de better auth. por eso el frontend no debe fijar `/api/auth/*` como contrato definitivo sin probar el entorno real.

### obtencion del token

al autenticarse exitosamente, better auth entrega una sesion reutilizable por el frontend. el contrato exacto de transporte de login no esta serializado en este repo porque lo maneja la libreria. para integracion de frontend, tratala como un token de sesion opaco: no es un JWT y no se debe decodificar ni depender de su formato interno.

el servicio manual de sesiones del repo genera tokens con `randomBytes(32).toString('hex')`, pero eso no debe asumirse como contrato publico de better auth. el frontend debe almacenar la sesion de forma segura y reenviarla en cada request autenticado.

---

## header de autenticacion

```
Authorization: Bearer <session-token>
```

el backend extrae el token del header `Authorization` con el prefijo `Bearer`. el decorador `@AuthToken()` realiza esta extraccion tanto en contextos REST como GraphQL.

si el header falta o tiene formato incorrecto, el backend responde con `UnauthorizedException`.

---

## queries y mutations de auth (GraphQL)

### queries

#### `me` → `AuthMeType`

devuelve el usuario autenticado y su sesion activa.

```graphql
query {
  me {
    user {
      id
      email
      name
      role
      emailVerified
      image
      banned
      banReason
      banExpires
      createdAt
      updatedAt
    }
    session {
      id
      token
      expiresAt
      createdAt
      ipAddress
      userAgent
      userId
    }
  }
}
```

si no hay sesion resuelta, este query devuelve `null`. si llega un token invalido y la capa de auth lo rechaza antes de resolver la sesion, puede devolver error de autenticacion.

#### `mySessions` → `[AuthSessionType]`

devuelve todas las sesiones activas del usuario actual (no expiradas).

```graphql
query {
  mySessions {
    id
    expiresAt
    createdAt
    ipAddress
    userAgent
  }
}
```

util para mostrar sesiones activas en la pagina de seguridad del perfil. si no hay sesion autenticada, el resolver devuelve `[]`.

### mutations

#### `signOutSession(sessionId: ID!)` → `SignOutResultType`

revoca una sesion especifica por su ID.

```graphql
mutation {
  signOutSession(sessionId: "uuid-de-sesion") {
    success
    message
  }
}
```

si no hay sesion autenticada, el resolver devuelve `{ success: false, message: "No autenticado" }`.

#### `signOutAll` → `SignOutResultType`

revoca todas las sesiones del usuario actual.

```graphql
mutation {
  signOutAll {
    success
    message
  }
}
```

si no hay sesion autenticada, el resolver devuelve `{ success: false, message: "No autenticado" }`.

---

## endpoints REST confirmados en este repo

ademas de GraphQL, el backend expone un controller REST local para operaciones complementarias de auth. estos endpoints si estan confirmados en codigo:

| metodo | ruta | descripcion | requiere auth |
|--------|------|-------------|---------------|
| GET | `/auth/session` | obtener sesion + usuario actual | si |
| GET | `/auth/me` | obtener usuario autenticado | si |
| GET | `/auth/validate` | validar si un token es valido | no (anonimo) |
| GET | `/auth/sessions` | listar sesiones activas | si |
| POST | `/auth/sign-out` | cerrar sesion actual | si |
| POST | `/auth/sign-out-all` | cerrar todas las sesiones | si |
| DELETE | `/auth/sessions/:id` | revocar sesion especifica | si |
| POST | `/auth/change-password` | cambiar contrasena | si |
| POST | `/auth/check-email` | verificar si un email existe | no (anonimo) |

estos endpoints no cubren sign-up ni sign-in. esas operaciones quedan delegadas a better auth y su ruta efectiva debe confirmarse en el entorno desplegado.

### ejemplo: validar token

```
GET /auth/validate
Authorization: Bearer <token>
```

responde con la sesion si el token es valido, o error si no.

### ejemplo: verificar email disponible

```
POST /auth/check-email
Content-Type: application/json

{ "email": "usuario@ejemplo.com" }
```

no requiere autenticacion. util para formularios de registro.

---

## ciclo de vida de la sesion

```
login (better auth)
  |
  v
sesion creada en BD
  - token: string opaco
  - expiresAt: segun la politica activa del proveedor de auth
  - userId, ipAddress, userAgent
  |
  v
frontend envia token en cada request
  |
  v
backend valida en cada request:
  1. token existe en BD
  2. sesion no ha expirado
  3. usuario no esta baneado
  |
  v
logout → sesion eliminada de BD (hard delete)
```

el servicio manual de sesiones usa **7 dias** por defecto cuando crea sesiones administrativas. en la configuracion de better auth revisada no aparece una duracion explicitamente sobreescrita, asi que el frontend no deberia fijar esa cifra como contrato sin probar el entorno real.

---

## como detectar sesion invalida o expirada

el backend lanza `UnauthorizedException` cuando:

- el token no existe en la base de datos
- la sesion ha expirado (`expiresAt < now`)
- el usuario esta baneado

en GraphQL esto suele aparecer como error de autenticacion. el literal exacto de `extensions.code` depende del adaptador GraphQL/Nest, asi que el frontend debe reaccionar por categoria de error mas que por una cadena unica obligatoria.

### recomendacion para el frontend

1. interceptar errores de autenticacion en GraphQL y HTTP 401 en REST
2. redirigir al usuario a la pagina de login
3. limpiar el token almacenado
4. no reintentar el request automaticamente — pedir re-login

---

## chequeos de usuario baneado

en cada request autenticado, el backend verifica si el usuario esta baneado. si esta baneado, el request es rechazado incluso con un token valido.

el tipo `AuthUserType` incluye los campos:

- `banned: Boolean!` — si el usuario esta baneado
- `banReason: String` — razon del baneo (puede ser null)
- `banExpires: DateTime` — fecha de expiracion del baneo (null = permanente)

el frontend puede usar estos campos desde la query `me` para mostrar un mensaje adecuado.

---

## contexto de autenticacion interno

para referencia, el backend construye un `AuthContext` que contiene:

```typescript
{
  userId: string
  email: string
  name: string
  role?: string
  sessionId: string
  sessionToken: string
  expiresAt: Date
  banned: boolean
  banReason?: string
  banExpires?: Date
  ipAddress?: string
  userAgent?: string
}
```

el frontend no tiene acceso directo a este objeto, pero los campos estan disponibles a traves de la query `me`.

---

## buenas practicas para el frontend

1. **almacenar el token de forma segura**: idealmente en memoria (variable de estado), no en localStorage. si se necesita persistencia entre tabs, considerar un mecanismo seguro.

2. **no decodificar el token**: no es JWT, es opaco. no contiene informacion util para el frontend.

3. **validar la sesion al cargar la app**: al iniciar, hacer una query `me` o un `GET /auth/validate` para confirmar que la sesion sigue activa.

4. **manejar expiracion globalmente**: configurar un interceptor/middleware en el cliente GraphQL que detecte errores `UNAUTHENTICATED` y redirija al login.

5. **no cachear la query `me` indefinidamente**: la sesion puede expirar o el usuario puede ser baneado entre requests. re-validar periodicamente o en eventos criticos (checkout, perfil).

6. **ofrecer logout de todas las sesiones**: la mutation `signOutAll` y la lista `mySessions` permiten construir una pagina de gestion de sesiones activas.

7. **cambio de contrasena**: el endpoint local `POST /auth/change-password` no implementa por si solo un flujo completo de cambio de contrasena. devuelve una instruccion para usar el flujo de better auth. para frontend, esto queda pendiente de confirmacion por entorno.
