# fulfillment, devoluciones y pagos

## separacion de dominios

el backend separa claramente tres responsabilidades en post-compra:

| dominio | responsabilidad | modulo |
|---------|----------------|--------|
| fulfillment | envios, tracking, metodos de envio, tarifas | `src/fulfillment/` |
| fulfillment | devoluciones (return authorizations, return items, customer returns) | `src/fulfillment/` |
| fulfillment | reembolsos (reimbursements, credits) | `src/fulfillment/` |
| payments | pagos, captura, gateway (stripe), refunds | `src/financial/payments/` |

la interaccion entre fulfillment y payments ocurre cuando un reembolso de fulfillment dispara un refund en payments.

### uso por tipo de frontend

**razonable para shopper**

- consultar `shipmentsByOrder`, `shipmentTracking`, `orderPayments`, `orderPaymentSummary`, `returnAuthorization`, `reimbursementsByOrder` y `orderRefunds`
- iniciar una solicitud de devolucion si el producto decide exponer `createReturnAuthorization` y `addReturnItem` al cliente final

**operativo o de backoffice**

- `createShipment`, `markShipmentPending`, `markShipmentReady`, `markShipmentShipped`, `markShipmentDelivered`, `setShipmentTracking`
- configuracion de `shippingMethods`, `shippingRates`, `shippingCategories`
- `authorizeReturnAuthorization`, `approveReturnAuthorization`, `rejectReturnAuthorization`, `cancelReturnAuthorization`, `createCustomerReturn`, `evaluateReturnItem`
- `createReimbursement`, `requestRefundForReimbursement`, `createRefund`, `capturePayment`

**orquestacion tecnica del flujo**

- `processPayment` puede formar parte de la integracion de checkout, pero no equivale por si solo a una confirmacion shopper client-side con Stripe Elements
- `requestRefundForReimbursement` conecta fulfillment con payments; no debe modelarse como la misma accion que un refund financiero directo del shopper
- `createReimbursement` y `capturePayment` pertenecen tambien a orquestacion operativa del proceso, no al recorrido shopper normal

---

## envios (shipments)

### estados de envio

```
pending → ready → shipped → delivered
```

cada transicion es unidireccional. no hay vuelta atras.

### crear un envio

```graphql
mutation {
  createShipment(input: {
    orderId: "uuid"
    addressId: "uuid-direccion"
    stockLocationId: "uuid-ubicacion"
    baseCost: 99.50
    tracking: "TRACK123456"
  }) {
    id
    number
    state
    order_id
    tracking
    cost
  }
}
```

el backend valida:
- que la orden sea fulfillable (estado `approved`)
- que la direccion exista
- que la ubicacion de stock exista

el `number` se genera automaticamente con formato `S{timestamp}{random}`.

esta mutation pertenece a flujo operativo/backoffice, no a UI shopper publica.

### consultar envios de una orden

```graphql
query {
  shipmentsByOrder(orderId: "uuid") {
    id
    number
    state
    tracking
    cost
    adjustment_total
    additional_tax_total
    promo_total
    shipped_at
    delivered_at
    shippingRates {
      id
      cost
      selected
    }
  }
}
```

### consultar tracking de un envio

```graphql
query {
  shipmentTracking(shipmentId: "uuid") {
    tracking
    shipmentId
  }
}
```

nota: el backend almacena un string de tracking pero no tiene integracion con APIs de carriers para tracking en tiempo real. el frontend puede usar el numero de tracking para redirigir al sitio del carrier.

### avanzar estado de envio

```graphql
mutation {
  markShipmentReady(input: { shipmentId: "uuid" }) {
    id
    state
    ready_at
  }
}

mutation {
  markShipmentShipped(input: { shipmentId: "uuid" }) {
    id
    state
    shipped_at
  }
}

mutation {
  markShipmentDelivered(input: { shipmentId: "uuid" }) {
    id
    state
    delivered_at
  }
}
```

estas mutations deben tratarse como operativas/backoffice. con el codigo revisado no hay señal de que formen parte de una UI shopper publica por defecto.

### actualizar tracking

```graphql
mutation {
  setShipmentTracking(input: {
    shipmentId: "uuid"
    tracking: "NUEVO-TRACKING-789"
  }) {
    id
    tracking
  }
}
```

---

## metodos de envio y tarifas

### listar metodos de envio

```graphql
query {
  shippingMethods(includeInactive: false) {
    id
    name
    description
    active
  }
}
```

### tarifas de un envio

```graphql
query {
  shippingRatesByShipment(shipmentId: "uuid") {
    id
    cost
    selected
    shippingMethodId
  }
}
```

### seleccionar tarifa de envio

```graphql
mutation {
  selectShippingRate(rateId: "uuid") {
    id
    selected_shipping_rate_id
    shippingRates {
      id
      selected
    }
  }
}
```

al seleccionar una tarifa, las demas se deseleccionan automaticamente y el resolver devuelve el `Shipment` actualizado.

---

## devoluciones

### flujo de devolucion

```
1. crear return authorization (solicitud de devolucion)
   estado: REQUESTED

2. agregar return items (items que se devuelven)

3. autorizar la devolucion
  estado: AUTHORIZED

4. registrar `customer return` (recepcion fisica como entidad separada)

5. evaluar cada item (aceptar/rechazar)

6. aprobar la devolucion (items aceptados se reintegran al inventario si se solicita)
   estado: APPROVED
```

### estados de autorizacion de devolucion

```
requested → authorized → approved
           ↘ rejected
           ↘ cancelled
```

nota: el resolver expone tambien `createCustomerReturn`, por lo que la recepcion fisica aparece modelada como entidad separada y no solo como una transicion visible en este diagrama simplificado.

### crear solicitud de devolucion

```graphql
mutation {
  createReturnAuthorization(input: {
    orderId: "uuid"
    reasonId: "uuid-razon"
    stockLocationId: "uuid-ubicacion"
    memo: "producto danado"
  }) {
    id
    number
    state
    order_id
    memo
    returnAuthorizationReason {
      id
      name
    }
  }
}
```

### agregar item a la devolucion

```graphql
mutation {
  addReturnItem(input: {
    returnAuthorizationId: "uuid"
    inventoryUnitId: "uuid"
    resellable: true
    exchangeVariantId: "uuid-variante-intercambio"
  }) {
    id
    reception_status
    acceptance_status
    resellable
    pre_tax_amount
  }
}
```

### evaluar un item devuelto

```graphql
mutation {
  evaluateReturnItem(input: {
    returnItemId: "uuid"
    receptionStatus: RECEIVED
    acceptanceStatus: ACCEPTED
    resellable: true
    autoReintegrate: true
    reintegrateToLocationId: "uuid-ubicacion"
  }) {
    id
    reception_status
    acceptance_status
    resellable
  }
}
```

si `autoReintegrate: true` y el item es aceptado, se reintegra al inventario automaticamente.

`evaluateReturnItem` pertenece a flujo operativo/backoffice.

### consultar razones de devolucion

```graphql
query {
  returnAuthorizationReasons(activeOnly: true) {
    id
    name
    active
  }
}
```

### aprobar devolucion

```graphql
mutation {
  approveReturnAuthorization(input: {
    returnAuthorizationId: "uuid"
    reintegrateAcceptedItems: true
    locationId: "uuid-ubicacion"
  }) {
    id
    state
  }
}
```

### consultar devoluciones

```graphql
query {
  returnAuthorization(id: "uuid") {
    id
    number
    state
    order_id
    memo
    returnAuthorizationReason {
      name
    }
    returnItems {
      id
      reception_status
      acceptance_status
      resellable
      pre_tax_amount
    }
  }
}
```

---

## reembolsos (reimbursements)

los reembolsos son el mecanismo financiero que conecta devoluciones con pagos.

### crear reembolso

```graphql
mutation {
  createReimbursement(input: {
    orderId: "uuid"
    customerReturnId: "uuid-customer-return"
    total: 299.50
  }) {
    id
    number
    reimbursement_status
    total
  }
}
```

el reembolso se crea en estado `DRAFT`.

`createReimbursement` pertenece a flujo operativo/backoffice.

### estados de reembolso

```
draft → pending → processing → completed
                            ↘ failed → pending (retry)
```

### solicitar refund al gateway de pago

```graphql
mutation {
  requestRefundForReimbursement(input: {
    reimbursementId: "uuid"
    refundReasonId: "uuid-razon"
    amount: 299.50
  }) {
    id
    reimbursement_status
  }
}
```

esta mutation:
1. busca el pago capturado de la orden
2. crea un refund en el dominio de payments
3. transiciona el reembolso a `PROCESSING`
4. el refund se procesa contra stripe

`requestRefundForReimbursement` pertenece a flujo operativo/backoffice y conecta reimbursement operativo con refund financiero.

### consultar reembolsos de una orden

```graphql
query {
  reimbursementsByOrder(orderId: "uuid") {
    id
    number
    reimbursement_status
    total
    reimbursementCredits {
      id
      amount
    }
  }
}
```

---

## pagos

### crear un pago

```graphql
mutation {
  createPayment(input: {
    orderId: "uuid"
    paymentMethodId: "uuid-metodo"
    amount: 500.00
  }) {
    id
    amount
    state
    number
    gateway_code
    payment_intent_id
  }
}
```

el backend:
1. valida que la orden sea pagable (estado `pending` o `approved`)
2. valida que el monto no exceda el `outstandingBalance`
3. valida que el metodo de pago este activo y habilitado para la tienda
4. crea el pago en estado `CHECKOUT`
5. si el metodo tiene `auto_capture`: procesa automaticamente
6. si no: lo mueve a `PENDING` y espera `processPayment`

nota: `payment_intent_id` puede salir `null` en la respuesta inicial de `createPayment` si el pago todavia no fue procesado. el identificador de Stripe aparece cuando `processPayment` o el flujo `auto_capture` ya crearon el PaymentIntent.

### estados de pago

```
checkout → pending → processing → authorized → captured
                              ↘ failed → pending (retry)
authorized → void
captured (terminal)
void (terminal)
```

### procesar un pago

```graphql
mutation {
  processPayment(input: { paymentId: "uuid" }) {
    id
    state
    payment_intent_id
    response_code
  }
}
```

crea un PaymentIntent en stripe con `capture_method: 'manual'` (autoriza pero no captura). el contrato GraphQL expone `payment_intent_id`, pero no expone `client_secret`.

con este contrato publico, el frontend puede:

- disparar `createPayment` y `processPayment`
- leer `payment_intent_id` como referencia tecnica del pago
- consultar el estado del pago y sus transiciones

con este contrato publico, el frontend no puede asumir que puede:

- confirmar un pago client-side con Stripe Elements
- completar `confirmPayment` del lado del navegador
- reconstruir `client_secret` a partir de `payment_intent_id`

### capturar un pago autorizado

```graphql
mutation {
  capturePayment(input: { paymentId: "uuid" }) {
    id
    state
    captured_amount
  }
}
```

captura el PaymentIntent previamente autorizado. transiciona a `CAPTURED`.

`capturePayment` no debe tratarse como accion shopper normal; pertenece a flujo operativo o a una orquestacion de pago definida por backend/producto.

### consultar pagos de una orden

```graphql
query {
  orderPayments(input: { orderId: "uuid" }) {
    id
    amount
    state
    gateway_code
    payment_intent_id
    captured_amount
    paymentMethod {
      id
      name
      type
    }
    refunds {
      id
      amount
      state
    }
  }
}
```

### resumen de pagos de la orden

```graphql
query {
  orderPaymentSummary(input: { orderId: "uuid" }) {
    orderId
    totalPaid
    outstandingBalance
    payments {
      id
      amount
      state
    }
  }
}
```

### metodos de pago disponibles

```graphql
query {
  paymentMethodsForStore(storeId: "uuid") {
    id
    name
    type
    description
    active
    auto_capture
  }
}
```

### refunds (devolucion de dinero)

```graphql
mutation {
  createRefund(input: {
    paymentId: "uuid"
    amount: 150.00
    refundReasonId: "uuid-razon"
  }) {
    id
    amount
    state
    transaction_id
  }
}
```

validaciones:
- el pago debe estar en estado `CAPTURED`
- el monto no puede exceder lo que resta por refundir (`captured_amount - refunds previos`)
- la razon de refund debe estar activa

`createRefund` es un refund financiero directo del dominio de payments. no debe mezclarse con `requestRefundForReimbursement`, que parte de un reimbursement del dominio de fulfillment.

### razones de refund

```graphql
query {
  refundReasons(includeInactive: false) {
    id
    name
    active
  }
}
```

---

## integracion con stripe

el backend usa stripe como gateway de pagos. detalles relevantes para el frontend:

- los pagos se crean con `capture_method: 'manual'` (autorizacion separada de captura)
- el `payment_intent_id` devuelto sirve como referencia del intento de pago, no como prueba suficiente para confirmacion client-side
- los montos se envian a stripe en centavos (amount * 100)
- el webhook de stripe esta en `POST /payments/webhooks/stripe` y maneja eventos como `payment_intent.succeeded`, `payment_intent.payment_failed`
- el frontend NO debe manejar webhooks — eso es responsabilidad del backend

nota sobre stripe.js: el backend crea el PaymentIntent con `automatic_payment_methods: { enabled: true, allow_redirects: 'never' }`. el `client_secret` existe internamente durante el procesamiento, pero no se expone en `PaymentType` ni en otra respuesta GraphQL revisada. por tanto, hoy el contrato publico no alcanza para una confirmacion client-side de Stripe Elements. eso requiere backend adicional o cambio de contrato.

---

## que debe consumir el frontend en post-compra

### pagina de confirmacion de orden

- `order(id)` — datos generales de la orden
- `orderPaymentSummary(orderId)` — estado del pago

### pagina de detalle de orden (post-compra)

- `order(id)` o `ownedOrder(input)` — datos de la orden
- `shipmentsByOrder(orderId)` — envios asociados
- `shipmentTracking(shipmentId)` — tracking de cada envio
- `orderPayments(orderId)` — pagos realizados
- `orderCommercialContext(input)` — resumen ejecutivo

### historial de ordenes

- `orderHistory(input)`

### pagina de devolucion

- `returnAuthorizationReasons(activeOnly: true)` — razones disponibles
- `createReturnAuthorization(orderId, reasonId)` — iniciar devolucion
- `addReturnItem(returnAuthorizationId, inventoryUnitId)` — agregar items
- `returnAuthorization(id)` — consultar estado

### estado de reembolso

- `reimbursementsByOrder(orderId)` — reembolsos asociados
- `orderRefunds(orderId)` — refunds procesados

---

## consideraciones para el frontend

- **el frontend no decide el estado de pago** — el backend maneja las transiciones basado en la respuesta de stripe.
- **no reintentar pagos fallidos automaticamente** — mostrar el error y dejar que el usuario decida.
- **el `outstandingBalance` es la fuente de verdad** para saber cuanto falta por pagar.
- **las devoluciones tienen flujo multi-paso** — el frontend debe guiar al usuario paso a paso (solicitar, agregar items, esperar aprobacion).
- **los refunds pueden tardar** — el estado puede quedar en `pending` hasta que stripe confirme. el frontend debe mostrar estado intermedio.
- **el tracking es un string libre** — no hay integracion con APIs de carriers. el frontend puede parsear el formato y linkear al sitio del carrier si lo desea.
