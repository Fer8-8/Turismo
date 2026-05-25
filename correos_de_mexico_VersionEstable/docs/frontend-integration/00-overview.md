# overview del backend para frontend

## que expone el backend

el backend es una API GraphQL construida con NestJS + Apollo + Prisma sobre PostgreSQL. expone un unico endpoint GraphQL en `/graphql` que consolida los dominios de negocio revisados.

GraphQL es la interfaz principal para producto, catalogo, ordenes, fulfillment y payments. adicionalmente hay dos superficies REST de auth que no deben mezclarse:

- rutas locales confirmadas en este repo bajo `/auth/*`
- rutas manejadas por better auth, cuya base exacta no queda declarada explicitamente en el codigo revisado

el webhook confirmado en codigo es `POST /payments/webhooks/stripe`.

el playground clasico de GraphQL esta deshabilitado (`playground: false`). en local tambien se registra `ApolloServerPluginLandingPageLocalDefault()`, asi que puede aparecer una landing page web, pero no conviene tratarla como contrato de integracion.

---

## dominios disponibles

el backend esta organizado en los siguientes dominios, cada uno con sus propios resolvers, DTOs y facades:

| dominio | descripcion | relevancia para frontend |
|---------|-------------|--------------------------|
| core/auth | autenticacion, sesion, tokens | alta - login, logout, sesion activa |
| core/user | usuarios de negocio (CdmUser), roles | alta - perfil, direcciones, ordenes del usuario |
| core/store | tiendas, multi-tenancy | alta - contexto de tienda en cada request |
| core/address | direcciones de envio/facturacion | alta - checkout, perfil |
| core/state | estados geograficos (legacy) | media - usado por direcciones |
| core/session | gestion de sesiones | baja - uso interno, el front interactua via auth |
| core/account | cuentas OAuth/credenciales | baja - uso interno |
| catalog/product | productos, variantes, precios | alta - listados, PDP, busqueda |
| catalog/catalog | taxonomias, taxones, properties | alta - navegacion, filtros, categorias |
| catalog/asset | imagenes, archivos, slugs | alta - galeria de producto, URLs amigables |
| location/geography | paises, estados | media - formularios de direccion |
| location/tax | categorias fiscales, tasas, zonas | baja - calculo automatico en backend |
| commercial-sales/sales | ordenes, line items, checkout | alta - carrito, checkout, historial |
| commercial-sales/marketing | promociones, codigos, evaluacion | alta - cupones, descuentos |
| inventory | stock, disponibilidad, reservas | media - el front consulta disponibilidad |
| fulfillment | envios, devoluciones, reembolsos | alta - post-compra, tracking |
| financial/payments | pagos, reembolsos, stripe | alta - checkout, post-compra |

---

## como se organiza el consumo desde frontend

### patron general de comunicacion

```
frontend
  |
  |-- Authorization: Bearer <session-token>
  |-- X-Store-Id: <uuid-de-tienda>
  |
  v
POST /graphql  (unico endpoint)
```

el consumo funcional del frontend se concentra en GraphQL. segun el flujo, puede intervenir tambien REST para autenticacion.

1. **header `Authorization`**: aplica a operaciones que dependen de sesion (formato `Bearer <token>`)
2. **header `X-Store-Id`**: aplica solo donde el backend active efectivamente `StoreContextGuard`

en el repositorio revisado existen `StoreContextGuard` y `@SkipStoreContext()`, pero no aparece su registro global como `APP_GUARD`. por eso esta documentacion trata `X-Store-Id` como un requisito de integracion previsto, no como una garantia de que absolutamente todos los resolvers lo exigen en esta rama.

### queries anonimas

varias queries de catalogo y assets estan marcadas con `@AllowAnonymous()`, lo que significa que no requieren autenticacion. esto permite al frontend:

- mostrar productos, categorias y taxonomias sin login
- resolver slugs de producto
- consultar paises y estados para formularios
- verificar disponibilidad de slug

### flujo tipico del frontend

1. el usuario llega al sitio → se carga el catalogo (anonimo)
2. el usuario inicia sesion → se obtiene token de sesion
3. se establece el contexto de tienda (`X-Store-Id`)
4. el usuario navega → queries de productos, categorias, assets
5. el usuario agrega al carrito → mutation `createOrder` + `addLineItem`
6. checkout → asignar direccion, recalcular totales, crear pago
7. post-compra → consultar envios, tracking, devoluciones

---

## que debe saber el frontend antes de integrarse

### 1. el schema no esta disponible via playground

el backend tiene `playground: false`. para generar tipos de typescript desde el schema se debe apuntar graphql-codegen al endpoint local o usar el archivo `src/schema.gql` directamente.

nota: el archivo `src/schema.gql` se autogenera pero puede no incluir todos los tipos de dominios nuevos si el esquema se genera en runtime con decoradores. se recomienda confiar en la introspeccion del endpoint activo.

### 2. el schema.gql autogenerado puede estar incompleto

el archivo `src/schema.gql` refleja solo los tipos registrados al momento de la ultima generacion. los dominios que usan decoradores `@ObjectType()` y `@Resolver()` exponen tipos adicionales que se consolidan en runtime. para obtener el schema completo se debe introspeccionar el servidor corriendo.

### 3. paginacion

el backend usa varios patrones de paginacion dependiendo del resolver. los confirmados en los contratos publicos revisados son:

- **productos**: paginacion por pagina (`page`, `limit`) → devuelve `ProductConnection { data, total, page, limit, pages }`
- **tiendas**: paginacion por offset (`skip`, `take`) → devuelve `{ items, totalCount, hasMore }`
- **otros dominios**: muchos resolvers devuelven arrays directos o wrappers propios, no un tipo paginado unico compartido

### 4. soft-delete

muchas entidades usan soft-delete (`deleted_at`). las queries normalmente excluyen registros eliminados automaticamente. el frontend no necesita filtrar por esto.

### 5. UUIDs

todos los IDs son UUID v4. el frontend debe enviar strings UUID validos en los inputs.

### 6. fechas

las fechas se manejan como `DateTime` scalar en GraphQL (formato ISO 8601). el frontend recibe y envia strings como `"2026-04-08T12:00:00.000Z"`.

### 7. montos monetarios

los precios y montos se representan como `String` o `Float` dependiendo del dominio:
- catalog: `String` (para precision decimal)
- sales/payments: `Float`

el frontend debe tratar todos los montos con precision decimal adecuada. se recomienda no usar aritmetica de punto flotante nativa para calculos financieros.

---

## notas de ambiguedad detectadas

- el modulo `postal/` existe en la estructura pero esta vacio. no hay funcionalidad postal expuesta.
- el archivo `src/schema.gql` contiene tipos placeholder para `Session` y `Account` (`exampleField: Int!`) que no reflejan los tipos reales expuestos por los resolvers.
- no existe un mecanismo de subscriptions/websockets confirmado en el backend. toda comunicacion es request-response.
- el frontend debe construir su propia capa de cache/estado. el backend no envia headers de cache especificos.
