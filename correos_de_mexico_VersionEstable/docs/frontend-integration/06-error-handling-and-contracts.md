# manejo de errores y contratos

## como vienen los errores en GraphQL

el backend devuelve errores usando el formato estandar de GraphQL. un response con error tiene esta estructura:

```json
{
  "data": null,
  "errors": [
    {
      "message": "descripcion legible del error",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["nombreDelResolver"],
      "extensions": {
        "code": "CODIGO_DE_ERROR",
        "stacktrace": ["..."]
      }
    }
  ]
}
```

en esta base no conviene asumir que `extensions.code` siempre reflejara el mismo valor que las excepciones custom. las excepciones propias del repo serializan `{ message, code }` en el body del error, mientras que GraphQL/Nest puede agregar su propio `extensions.code` dependiendo del adaptador.

nota: el campo `stacktrace` solo aparece en desarrollo. en produccion puede omitirse.

---

## jerarquia de excepciones del backend

el backend define una jerarquia de excepciones custom basada en `AppException`:

| excepcion | HTTP status | code en extensions | significado |
|-----------|-------------|-------------------|-------------|
| `BusinessException` | 422 | `BUSINESS_RULE_VIOLATION` por default | regla de negocio violada |
| `AppNotFoundException` | 404 | `NOT_FOUND` | recurso no encontrado |
| `AppValidationException` | 400 | `VALIDATION_ERROR` | input invalido |
| `AppConflictException` | 409 | `CONFLICT` | recurso duplicado |
| `UnauthorizedAccessException` | 403 | `UNAUTHORIZED_ACCESS` | sin acceso/permiso |
| `MissingStoreIdException` | 400 | `MISSING_STORE_ID` | falta header X-Store-Id |

ademas, NestJS agrega:

| excepcion | code en extensions | significado |
|-----------|-------------------|-------------|
| `UnauthorizedException` | variable segun adaptador | token invalido o sesion expirada |

---

## errores comunes por dominio

### autenticacion

| error | cuando ocurre | que debe hacer el front |
|-------|---------------|------------------------|
| `UnauthorizedException` | token invalido, sesion expirada, usuario baneado | redirigir a login, limpiar sesion |
| `UnauthorizedAccessException` | usuario sin acceso al recurso o tienda | mostrar mensaje de acceso denegado |

### store context

| error | cuando ocurre | que debe hacer el front |
|-------|---------------|------------------------|
| `MissingStoreIdException` | falta el header | verificar configuracion del cliente GraphQL |
| `UnauthorizedAccessException` | UUID invalido o acceso denegado | verificar storeId, recargar configuracion |

### ordenes y checkout

| error | cuando ocurre | que debe hacer el front |
|-------|---------------|------------------------|
| `OrderNotFoundException` | orden no existe | mostrar "orden no encontrada" |
| `OrderNotEditableException` | intentar editar orden que no esta en cart/address | deshabilitar acciones de edicion |
| `DuplicateLineItemException` | agregar variante que ya esta en la orden | usar `updateLineItemQuantity` en vez de `addLineItem` |
| `VariantUnavailableException` | variante no disponible o descontinuada | mostrar "producto no disponible" |
| `InsufficientInventoryException` | no hay stock suficiente | mostrar cantidad maxima disponible |
| `LineItemQuantityException` | cantidad <= 0 | validar antes de enviar |
| `OrderOwnershipException` | la orden no pertenece al usuario | no mostrar la orden |
| `InvalidOrderStateTransitionException` | transicion de estado invalida | actualizar estado y deshabilitar boton |
| `OrderAddressNotFoundException` | direccion no existe | pedir al usuario reseleccionar direccion |
| `OrderNotPayableException` | intentar pagar orden no pagable | verificar estado de la orden |

### catalogo

| error | cuando ocurre | que debe hacer el front |
|-------|---------------|------------------------|
| `NOT_FOUND` | producto/variante no encontrado | mostrar 404, redirigir |
| `CONFLICT` | slug duplicado (admin) | informar al usuario |

### pagos

| error | cuando ocurre | que debe hacer el front |
|-------|---------------|------------------------|
| `PaymentProcessingException` | fallo al procesar con stripe | mostrar mensaje de error de pago |
| `PaymentAmountMismatchException` | monto excede outstandingBalance | recalcular monto con datos frescos |
| `PaymentMethodDisabledException` | metodo de pago inactivo | recargar metodos disponibles |
| `PaymentMethodNotAvailableForStoreException` | metodo no habilitado para la tienda | filtrar metodos por tienda |
| `PaymentNotAuthorizedException` | intentar capturar pago no autorizado | verificar estado del pago |
| `RefundAmountExceededException` | refund excede lo capturado | mostrar monto maximo refundable |

### fulfillment

| error | cuando ocurre | que debe hacer el front |
|-------|---------------|------------------------|
| `ShipmentNotFoundException` | envio no encontrado | mostrar mensaje apropiado |
| `ShipmentStateTransitionException` | transicion de estado invalida | actualizar estado del envio |
| `ReturnAuthorizationNotFoundException` | devolucion no encontrada | verificar ID |
| `ReturnAuthorizationStateTransitionException` | transicion de devolucion invalida | actualizar estado |
| `ReimbursementStateTransitionException` | transicion de reembolso invalida | actualizar estado |

---

## como distinguir errores de negocio vs errores tecnicos

### errores de negocio (esperados)

son errores que el backend lanza intencionalmente como parte de la logica de negocio. el frontend debe manejarlos con UI apropiada.

indicadores:
- la excepcion pertenece a la jerarquia `AppException` o `BusinessException`
- el body del error contiene un `code` propio del backend cuando aplica
- el `message` es descriptivo y orientado al usuario
- el error tiene sentido en el contexto de la operacion

ejemplos:
- "insufficient stock for variant X" → mostrar "sin stock disponible"
- "order is not editable in current state" → deshabilitar edicion
- "duplicate line item" → usar update en vez de add

### errores tecnicos (inesperados)

son errores de infraestructura, bugs o fallos no controlados.

indicadores:
- GraphQL devuelve un error generico sin un code de dominio claro
- el `message` puede ser generico ("internal server error")
- puede incluir stacktrace en desarrollo

recomendacion:
- mostrar un mensaje generico al usuario ("ocurrio un error inesperado")
- loggear el error completo en consola para depuracion
- no reintentar automaticamente sin entender la causa

---

## validaciones que debe contemplar el frontend

### antes de enviar al backend

| campo | validacion |
|-------|-----------|
| email | formato valido, `^[^\s@]+@[^\s@]+\.[^\s@]+$` |
| telefono | formato `^(\+\d{1,3})?[\s.-]?\d{7,14}$` |
| UUID | formato UUID general `^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$` |
| codigo postal | formato `^\d{5}(-\d{4})?$` |
| password | minimo 8 caracteres |
| slug | formato `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| nombre de producto | minimo 3, maximo 255 caracteres |
| quantity | entero positivo (>= 1) |
| montos | numeros >= 0 |

estas validaciones coinciden con los regex definidos en `core/shared/config/shared.config.ts`. el backend las aplica con `class-validator` — si el frontend las aplica tambien, reduce roundtrips innecesarios.

### despues de recibir la respuesta

- verificar que `data` no sea `null`
- verificar que `errors` sea undefined o vacio
- para operaciones criticas (pagos), verificar el campo `state` del resultado

---

## patron recomendado de manejo de errores

```typescript
// ejemplo generico para un cliente GraphQL
async function executeGraphQL<T>(query: string, variables?: object): Promise<T> {
  const response = await client.query({ query, variables });
  
  if (response.errors?.length) {
    const error = response.errors[0];
    const code =
      error.extensions?.originalError?.code ??
      error.extensions?.response?.code ??
      error.extensions?.code;
    
    switch (code) {
      case 'UNAUTHENTICATED':
        // redirigir a login
        clearSession();
        redirectToLogin();
        throw new AuthError(error.message);
        
      case 'MISSING_STORE_ID':
        // falta contexto de tienda
        throw new ConfigError(error.message);
        
      case 'UNAUTHORIZED_ACCESS':
        // sin permiso
        throw new AccessError(error.message);
        
      case 'NOT_FOUND':
        // recurso no existe
        throw new NotFoundError(error.message);
        
      case 'BUSINESS_RULE_VIOLATION':
      case 'VALIDATION_ERROR':
      case 'CONFLICT':
        // error de negocio - mostrar al usuario
        throw new BusinessError(error.message);
        
      default:
        // error tecnico
        console.error('GraphQL error:', error);
        throw new TechnicalError('ocurrio un error inesperado');
    }
  }
  
  return response.data;
}
```

---

## paginacion como contrato

el backend usa dos patrones de paginacion. el frontend debe manejar ambos:

### patron 1: paginacion por pagina (catalogo)

```graphql
query {
  products(filterProductsInput: { page: 1, limit: 20 }) {
    data { ... }
    total       # total de registros
    page        # pagina actual
    limit       # items por pagina
    pages       # total de paginas
  }
}
```

### patron 2: paginacion por offset (otros dominios)

los servicios internos usan `skip`/`take` o `offset`/`limit` con limites:

- `limit` default: 20
- `limit` maximo: 100
- `limit` minimo: 1

algunos resolvers devuelven arrays directos sin wrapper de paginacion.

---

## contratos de input relevantes (resumen)

### filtro de productos

```graphql
input FilterProductsInput {
  page: Int = 1      # minimo 1
  limit: Int = 10    # minimo 1, maximo 100
  search: String     # busca en nombre y descripcion
  slug: String       # match exacto
  sku: String        # busca en variantes
  available: Boolean # filtra por disponibilidad
}
```

### orden

```graphql
input CreateOrderInput {
  userId: ID!
  storeId: ID!
  lineItems: [LineItemInput!]!  # minimo 1
  currency: String
  channel: String
}

input LineItemInput {
  variantId: ID!
  quantity: Int!  # minimo 1
}
```

### direccion

```graphql
input CreateAddressInput {
  firstname: String!
  lastname: String!
  address1: String!
  address2: String
  city: String!
  zipcode: String!
  phone: String!
  alternative_phone: String
  company: String
  state_id: ID!
  country_id: String
  user_id: String
  label: String
}
```

---

## recomendaciones de UX para errores

1. **errores de stock**: mostrar inmediatamente en el carrito cuando la cantidad no esta disponible. no esperar al checkout.

2. **errores de sesion**: interceptar globalmente y redirigir al login. no dejar que el usuario vea un error tecnico.

3. **errores de pago**: mostrar el `message` del error de forma amigable. los mensajes de stripe suelen ser descriptivos.

4. **errores de validacion**: resaltar los campos invalidos en el formulario antes de enviar. el backend rechaza con 422 si los datos no cumplen las validaciones.

5. **estados de carga**: las operaciones de pago y checkout pueden tardar segundos. mostrar indicadores de carga y deshabilitar botones para evitar doble-submit.

6. **reintentos**: solo reintentar operaciones idempotentes (queries). no reintentar mutations de pago o checkout automaticamente.
