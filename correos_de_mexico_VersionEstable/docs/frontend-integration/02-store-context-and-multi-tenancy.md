# contexto de tienda y multi-tenancy

## como funciona X-Store-Id

el backend implementa multi-tenancy a nivel de tienda. cada tienda (`Store`) es una entidad con su propia configuracion, productos habilitados, metodos de pago, promociones y taxonomias.

el frontend debe enviar el header `X-Store-Id` con el UUID de la tienda activa en la mayoria de requests GraphQL.

```
X-Store-Id: <uuid-de-tienda>
```

el nombre del header es case-insensitive (`x-store-id`, `X-Store-Id`, `X-STORE-ID` son equivalentes).

---

## que hace el backend con este header

el repositorio incluye un `StoreContextGuard` pensado para GraphQL. en los archivos revisados no aparece su registro global como `APP_GUARD`, asi que este comportamiento debe leerse como el mecanismo previsto, no como una garantia de que todos los resolvers ya lo esten aplicando en esta rama.

cuando el guard esta activo, realiza las siguientes validaciones:

1. **verifica que el header exista** y no este vacio
2. **busca la tienda en la BD** para confirmar que existe
3. **si el usuario esta autenticado**: intenta validar acceso de usuario a tienda
4. **inyecta el contexto** en el request como `{ storeId: string }`

en su implementacion actual, la validacion de acceso usuario-tienda es un placeholder: si existe un `cdmUser`, devuelve acceso a cualquier tienda. no hay una tabla de permisos aplicada aqui.

---

## cuando debe enviarlo el frontend

**tratalo como requisito cuando tu entorno tenga activado el guard**, especialmente en flujos scoped a tienda como:

- queries de productos por tienda (`productsByStore`)
- creacion de ordenes (`createOrder` — requiere `storeId` en el input)
- consulta de ordenes y historial
- consulta de promociones activas por tienda
- consulta de metodos de pago por tienda
- creacion de pagos
- creacion de envios
- cualquier operacion que dependa de datos scoped a una tienda

---

## cuando NO aplica

las siguientes operaciones si estan marcadas con `@SkipStoreContext()` en el codigo revisado y **no requieren** el header cuando ese guard esta activo:

| dominio | operaciones |
|---------|-------------|
| auth | `me`, `mySessions`, `signOutSession`, `signOutAll` |
| store | `store`, `storeByCode`, `stores` y el resto de queries/mutations del resolver de tiendas |
| state/account | los resolvers revisados de `core/state` y `core/account` usan `@SkipStoreContext()` |

**nota importante**: `@AllowAnonymous()` y `@SkipStoreContext()` son conceptos distintos. en los resolvers de catalogo revisados se observa `@AllowAnonymous()`, pero no `@SkipStoreContext()`. por eso no conviene afirmar que esos queries siempre omiten `X-Store-Id`; depende de si el guard esta realmente enchufado en tu despliegue.

---

## que flujos dependen de tienda

### productos y catalogo

- `productsByStore(storeId)` devuelve solo productos asignados a esa tienda
- las taxonomias pueden estar scoped a una tienda via `store_id` en el modelo `Taxonomy`
- `taxonomiesByStore(storeId)` devuelve taxonomias asignadas a la tienda

### ordenes y checkout

- `createOrder` requiere `storeId` en el input. la orden queda asociada a la tienda
- las validaciones de inventario y variante verifican disponibilidad en el contexto de la tienda
- la consulta de historial de ordenes puede filtrar por `storeId`

### promociones

- las promociones pueden ser globales o asignadas a tiendas especificas
- `listActivePromotions(storeId?)` devuelve promociones activas para la tienda o globales
- `listPromotionsByStore(storeId)` devuelve solo las asignadas a esa tienda

### metodos de pago

- los metodos de pago se asocian a tiendas
- `paymentMethodsForStore(storeId)` devuelve los metodos habilitados para la tienda
- la creacion de pagos valida que el metodo de pago este disponible para la tienda de la orden

### envios

- la creacion de shipments valida el contexto de la orden (incluye tienda)

---

## errores por header faltante o invalido

### header faltante

si el frontend no envia `X-Store-Id` en una operacion que lo requiere:

```json
{
  "errors": [
    {
      "message": "Missing required header X-Store-Id"
    }
  ]
}
```

este es un `MissingStoreIdException` (HTTP 400). internamente la excepcion usa el code `MISSING_STORE_ID`.

### tienda no encontrada

si el UUID enviado no corresponde a ninguna tienda en la BD:

```json
{
  "errors": [
    {
      "message": "Store with ID \"...\" does not exist or is inactive"
    }
  ]
}
```

este es un `UnauthorizedAccessException` (HTTP 403). internamente la excepcion usa el code `UNAUTHORIZED_ACCESS`.

### usuario sin acceso a la tienda

si el usuario no tiene permiso para operar en la tienda indicada, la clase usada sigue siendo `UnauthorizedAccessException`.

---

## como obtener el storeId

### listar tiendas disponibles

```graphql
query {
  stores {
    items {
      id
      name
      code
      url
      is_active
      default
      default_currency
      default_locale
      supported_currencies
      supported_locales
    }
    totalCount
    hasMore
  }
}
```

### obtener tienda por codigo

```graphql
query {
  storeByCode(code: "mx-main") {
    id
    name
    code
    is_active
    default_currency
  }
}
```

el `code` es unico por tienda. puede servir para que el frontend resuelva la tienda desde una variable de configuracion o subdominio.

### obtener la tienda default

no existe una query especifica `defaultStore`. el frontend puede:
1. listar tiendas y filtrar por `default: true`
2. usar `storeByCode` con un codigo conocido

---

## como debe manejar el frontend el contexto de tienda

### recomendaciones

1. **almacenar el `storeId` en el estado global** de la app (context, store, etc.). idealmente resolverlo al cargar la aplicacion.

2. **configurar el cliente GraphQL** para enviar `X-Store-Id` automaticamente en cada request:

```typescript
// ejemplo con apollo client
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const storeLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'X-Store-Id': getCurrentStoreId(),
  },
}));

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'Authorization': `Bearer ${getSessionToken()}`,
  },
}));

const client = new ApolloClient({
  link: from([authLink, storeLink, httpLink]),
  cache: new InMemoryCache(),
});
```

3. **no hardcodear el storeId**. resolverlo dinamicamente via `storeByCode` o la lista de tiendas.

4. **si tu UI expone selector de tienda**, revisar `is_active` sigue siendo util para no ofrecer tiendas deshabilitadas. el guard revisado valida existencia, no una politica de acceso mas fina.

5. **las queries de catalogo anonimas son una zona gris**: algunas no requieren store context pero la data puede estar scoped a tienda. cuando se consultan productos, es recomendable usar `productsByStore(storeId)` en vez de `products()` si se quiere respetar el scope de tienda.

---

## modelo de datos de tienda (referencia)

los campos mas relevantes del tipo `Store` para el frontend:

```graphql
type Store {
  id: ID!
  name: String!
  code: String!                      # identificador unico legible
  url: String                        # URL de la tienda
  is_active: Boolean!                # si esta habilitada
  default: Boolean!                  # si es la tienda por defecto
  default_currency: String           # moneda principal (e.g. "MXN")
  default_locale: String             # locale (e.g. "es-MX")
  supported_currencies: String       # currencies adicionales
  supported_locales: String          # locales adicionales
  customer_support_email: String     # email de soporte
  meta_description: String           # SEO
  meta_keywords: String              # SEO
  seo_title: String                  # SEO
  facebook: String                   # redes sociales
  twitter: String
  instagram: String
  contact_phone: String
}
```

---

## ambiguedades detectadas

- no se confirma desde el codigo si el guard de store context se aplica globalmente. en los archivos revisados no aparece su registro como `APP_GUARD`.
- la validacion de acceso usuario-tienda esta resuelta con un placeholder: cualquier `cdmUser` autenticado termina con acceso permitido. si el producto necesita restricciones por tienda, eso sigue dependiendo de una decision del equipo.
- los campos `supported_currencies` y `supported_locales` son strings sueltos, no arrays. el formato interno exacto queda pendiente de confirmacion desde el codigo revisado.
