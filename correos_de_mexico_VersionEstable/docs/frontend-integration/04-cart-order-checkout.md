# carrito, ordenes y checkout

## modelo de orden

en este backend no hay un concepto separado de "carrito". la orden empieza en estado `cart` y evoluciona a traves de una maquina de estados hasta completarse o cancelarse.

### que puede asumir el frontend shopper

- `createOrder`, `addLineItem`, `updateLineItemQuantity`, `removeLineItem` y `assignOrderAddress` si encajan de forma natural en una UI publica de carrito y checkout
- `validatePromoCode` y, si el producto lo necesita, `evaluateOrderPromotions` pueden apoyar la experiencia de checkout, aunque esta ultima vive en marketing
- `order`, `orderByNumber`, `orderHistory`, `ownedOrder` y los contextos de orden son consultas razonables para shopper autenticado

### operaciones de orquestacion comercial

- `markOrderPending` y `approveOrder` existen como mutations publicas, pero representan cambio de estado/orquestacion de la orden. no deberian exponerse al shopper como acciones directas sin una decision explicita de producto
- `recalculateOrderTotals` existe como contrato publico, pero en el flujo revisado funciona mejor como apoyo tecnico o re-sincronizacion que como accion visible del usuario

### estados de la orden

```
cart → address → pending → approved → cancelled
```

| estado | significado | editable | pagable | fulfillable |
|--------|-------------|----------|---------|-------------|
| `cart` | carrito en construccion | si | no | no |
| `address` | direccion asignada | si | no | no |
| `pending` | pendiente de aprobacion | no | si | no |
| `approved` | aprobada para fulfillment y pago | no | si | si |
| `cancelled` | cancelada (terminal) | no | no | no |

transiciones validas:
- `cart` → `address`, `cancelled`
- `address` → `pending`, `cancelled`
- `pending` → `approved`, `cancelled`
- `approved` → `cancelled`
- `cancelled` → (ninguna, es terminal)

---

## crear una orden (carrito)

```graphql
mutation {
  createOrder(input: {
    userId: "uuid-del-usuario"
    storeId: "uuid-de-tienda"
    lineItems: [
      { variantId: "uuid-variante-1", quantity: 2 },
      { variantId: "uuid-variante-2", quantity: 1 }
    ]
    currency: "MXN"
    channel: "web"
  }) {
    id
    number
    state
    item_total
    total
    lineItems {
      id
      variant_id
      price
      quantity
      currency
    }
  }
}
```

### que hace el backend al crear la orden

1. valida que el usuario exista
2. valida acceso a la tienda
3. para cada line item:
   - valida que la variante exista y este disponible
   - obtiene el precio base de la variante
   - si la variante tiene `track_inventory: true`, verifica disponibilidad de inventario
4. crea la orden en estado `cart`
5. inserta los line items con sus precios
6. calcula totales iniciales (sin impuestos porque aun no hay direccion)
7. emite evento `OrderCreatedEvent`

el campo `number` se genera automaticamente con formato `R{timestamp}{random}`.

---

## agregar un line item a una orden existente

```graphql
mutation {
  addLineItem(input: {
    orderId: "uuid-de-orden"
    variantId: "uuid-variante"
    quantity: 1
  }) {
    id
    variant_id
    price
    quantity
  }
}
```

validaciones:
- la orden debe estar en estado `cart` o `address` (editable)
- no se permite agregar la misma variante dos veces (lanza `DuplicateLineItemException`)
- se valida disponibilidad de inventario
- se recalculan los totales de la orden

---

## actualizar cantidad de un line item

```graphql
mutation {
  updateLineItemQuantity(input: {
    lineItemId: "uuid-line-item"
    orderId: "uuid-de-orden"
    quantity: 3
  }) {
    id
    quantity
    price
  }
}
```

validaciones:
- la orden debe ser editable (`cart` o `address`)
- `quantity` debe ser mayor a 0
- se valida la nueva cantidad contra inventario
- se recalculan totales

---

## eliminar un line item

```graphql
mutation {
  removeLineItem(input: {
    orderId: "uuid-de-orden"
    lineItemId: "uuid-line-item"
  })
}
```

devuelve `Boolean`. la orden debe ser editable. se recalculan totales.

---

## consultar line items de una orden

```graphql
query {
  orderLineItems(orderId: "uuid") {
    id
    order_id
    variant_id
    price
    quantity
    currency
    cost_price
    adjustment_total
    promo_total
    additional_tax_total
    included_tax_total
    pre_tax_amount
    tax_category_id
  }
}
```

---

## asignar direccion a la orden

```graphql
mutation {
  assignOrderAddress(input: {
    orderId: "uuid-de-orden"
    shipAddressId: "uuid-direccion-envio"
    billAddressId: "uuid-direccion-facturacion"
  }) {
    id
    state
    ship_address_id
    bill_address_id
  }
}
```

### que ocurre al asignar direccion

1. valida que la orden sea editable
2. valida que las direcciones existan
3. asigna las direcciones a la orden
4. si la orden estaba en `cart`, transiciona a `address`
5. recalcula impuestos basados en la zona fiscal de la direccion de envio

el calculo de impuestos usa el `state_id` de la direccion de envio para resolver la zona fiscal, y aplica las tasas correspondientes a cada line item segun su `tax_category_id`.

---

## aplicar promociones

### validar un codigo promocional

```graphql
mutation {
  validatePromoCode(input: { code: "DESCUENTO20" }) {
    promotionId
    code
    valid
    reason
  }
}
```

si `valid: false`, el campo `reason` explica por que (expirado, no activo, limite alcanzado).

### evaluar promociones para una orden

las promociones se evaluan automaticamente al recalcular totales de la orden. el flujo interno es:

1. el `OrderPricingService` llama al gateway de promociones
2. el gateway busca promociones activas para la tienda (o globales)
3. evalua reglas de cada promocion contra la orden:
   - tipo `product`: aplica a line items de ciertos productos
   - tipo `variant`: aplica a variantes especificas
   - tipo `user`: aplica a usuarios especificos
   - tipo `code`: requiere que la orden tenga un codigo
4. calcula descuentos segun las acciones configuradas:
   - `order_fixed_discount`: descuento fijo en el total
   - `order_percent_discount`: porcentaje de descuento en el total
   - `line_item_fixed_discount`: descuento fijo por line item
   - `line_item_percent_discount`: porcentaje por line item
5. los descuentos se distribuyen en los campos `promo_total` de cada line item y la orden

el frontend tambien puede evaluar manualmente promociones. esta mutation pertenece al resolver de marketing, no al resolver de sales, aunque impacta el checkout:

```graphql
mutation {
  evaluateOrderPromotions(input: {
    orderId: "uuid"
    storeId: "uuid"
    userId: "uuid"
    itemTotal: 500.00
    promoCode: "DESCUENTO20"
    lineItems: [
      {
        lineItemId: "uuid-li-1"
        variantId: "uuid-var-1"
        quantity: 2
        unitPrice: 200.00
        lineSubtotal: 400.00
      },
      {
        lineItemId: "uuid-li-2"
        variantId: "uuid-var-2"
        quantity: 1
        unitPrice: 100.00
        lineSubtotal: 100.00
      }
    ]
  }) {
    orderPromoTotal
    lineAdjustments {
      lineItemId
      promoTotal
    }
    adjustmentTotal
    appliedPromotionIds
  }
}
```

nota: los montos de descuento son negativos (representan reduccion).

---

## recalcular totales de la orden

```graphql
mutation {
  recalculateOrderTotals(orderId: "uuid") {
    id
    item_total
    adjustment_total
    promo_total
    additional_tax_total
    included_tax_total
    shipment_total
    payment_total
    total
    item_count
  }
}
```

este mutation fuerza un recalculo completo: impuestos + promociones + consolidacion de totales. se ejecuta automaticamente al agregar/remover/actualizar line items y al asignar direcciones.

---

## avanzar la orden a pending

esta mutation debe tratarse como paso de orquestacion comercial, no como boton shopper por defecto.

```graphql
mutation {
  markOrderPending(input: { orderId: "uuid" }) {
    id
    state
    total
    additional_tax_total
  }
}
```

requiere que la orden este en estado `address`. al marcar como pending:
1. recalcula impuestos (con la direccion asignada)
2. recalcula promociones
3. transiciona a estado `pending`
4. emite `OrderPendingEvent`

---

## aprobar la orden

esta mutation debe tratarse como paso de orquestacion comercial, no como accion shopper directa.

```graphql
mutation {
  approveOrder(input: { orderId: "uuid" }) {
    id
    state
    approved_at
  }
}
```

requiere estado `pending`. al aprobar:
1. transiciona a `approved`
2. registra `approved_at`
3. emite `OrderApprovedEvent`

en estado `approved` la orden puede recibir pagos y ser fulfillable.

si el frontend shopper solo necesita comprar y consultar su orden, conviene consumir estas transiciones como efecto del flujo comercial definido por backend/producto, no como CTA explicita del usuario final.

---

## cancelar la orden

```graphql
mutation {
  cancelOrder(input: {
    orderId: "uuid"
    reason: "cliente solicito cancelacion"
  }) {
    id
    state
    canceled_at
  }
}
```

se puede cancelar desde cualquier estado (excepto `cancelled`). registra `canceled_at` y la razon. emite `OrderCancelledEvent`.

---

## consultar ordenes

### orden por ID

```graphql
query {
  order(id: "uuid") {
    id
    number
    state
    email
    currency
    channel
    item_total
    adjustment_total
    promo_total
    shipment_total
    additional_tax_total
    included_tax_total
    payment_total
    total
    item_count
    ship_address_id
    bill_address_id
    completed_at
    approved_at
    canceled_at
    created_at
    lineItems {
      id
      variant_id
      price
      quantity
      promo_total
      additional_tax_total
    }
  }
}
```

### orden por numero

```graphql
query {
  orderByNumber(number: "R17123456789abc") {
    id
    state
    total
  }
}
```

### historial de ordenes del usuario

```graphql
query {
  orderHistory(input: {
    userId: "uuid"
    storeId: "uuid"
    state: "approved"
    page: 1
    take: 10
  }) {
    items {
      id
      number
      state
      total
      item_count
      created_at
      approved_at
    }
    total
    page
    take
  }
}
```

### orden propia (con validacion de ownership)

```graphql
query {
  ownedOrder(input: {
    orderId: "uuid"
    userId: "uuid"
    storeId: "uuid"
  }) {
    id
    number
    state
    total
  }
}
```

lanza `OrderOwnershipException` si la orden no pertenece al usuario.

---

## contextos para otros dominios

el frontend puede consultar el contexto de una orden para entender que acciones son posibles:

### contexto de pago

```graphql
query {
  orderPaymentContext(input: { orderId: "uuid" }) {
    orderId
    state
    storeId
    currency
    total
    paymentTotal
    outstandingBalance
    payable
  }
}
```

`payable: true` cuando la orden esta en `pending` o `approved` y hay saldo pendiente.

### contexto de fulfillment

```graphql
query {
  orderFulfillmentContext(input: { orderId: "uuid" }) {
    orderId
    state
    storeId
    shipAddressId
    billAddressId
    fulfillable
    lineItems {
      id
      variant_id
      quantity
    }
  }
}
```

`fulfillable: true` solo cuando la orden esta en `approved`.

### contexto comercial

```graphql
query {
  orderCommercialContext(input: { orderId: "uuid" }) {
    orderId
    number
    state
    storeId
    userId
    total
    paymentTotal
    outstandingBalance
    payable
    fulfillable
    itemCount
    approvedAt
    canceledAt
  }
}
```

resumen ejecutivo de la orden con flags de estado.

`markOrderPending` y `approveOrder` deben leerse como contratos publicos del backend, pero no como acciones shopper recomendadas por defecto. son pasos de orquestacion o de operacion del proceso comercial hasta que producto defina otra cosa.

---

## flujo completo de checkout para el frontend

```
1. createOrder(userId, storeId, lineItems)
   → orden en estado "cart"
   → el front almacena orderId

2. (opcional) addLineItem / updateLineItemQuantity / removeLineItem
   → modificar el carrito
   → los totales se recalculan automaticamente

3. assignOrderAddress(orderId, shipAddressId, billAddressId)
   → orden transiciona a "address"
   → impuestos se calculan con la zona de la direccion de envio

4. (opcional) validatePromoCode(code)
   → verificar si un codigo es valido
   → los descuentos se aplican al recalcular totales

5. markOrderPending(orderId)
   → orden transiciona a "pending"
   → recalculo final de impuestos y promociones

6. aprobar orden (puede ser automatico o manual segun el negocio)
   approveOrder(orderId)
   → orden transiciona a "approved"

7. crear pago
   createPayment(orderId, paymentMethodId, amount)
   → se procesa el pago (ver 05-fulfillment-returns-payments.md)

8. (post-checkout)
   → consultar estado de envios, tracking
   → consultar estado de pagos
```

---

## datos que el frontend debe mandar vs los que recibe

### al crear orden

**envia**:
- `userId` (UUID)
- `storeId` (UUID)
- `lineItems` (array de `{ variantId, quantity }`, minimo 1)
- `currency` (opcional, e.g. "MXN")
- `channel` (opcional, e.g. "web")

**recibe**:
- orden completa con `id`, `number`, `state`, totales, line items con precios

### al agregar line item

**envia**: `orderId`, `variantId`, `quantity`  
**recibe**: line item creado con precio resuelto

### al asignar direccion

**envia**: `orderId`, `shipAddressId` y/o `billAddressId`  
**recibe**: orden actualizada con nuevo estado y totales recalculados

### al crear pago

**envia**: `orderId`, `paymentMethodId`, `amount`  
**recibe**: pago creado con estado y detalles del gateway

---

## consideraciones de consistencia y validacion

- **no se permiten variantes duplicadas** en una misma orden. si el frontend intenta agregar la misma variante dos veces, recibe `DuplicateLineItemException`. para aumentar cantidad, usar `updateLineItemQuantity`.

- **la orden solo es editable en `cart` y `address`**. intentar agregar/remover items en otros estados lanza `OrderNotEditableException`.

- **los totales se recalculan automaticamente** al modificar line items y al asignar direcciones. no es necesario llamar `recalculateOrderTotals` manualmente a menos que se quiera forzar un recalculo.

- **los impuestos dependen de la direccion de envio**. sin direccion, los impuestos son cero. el frontend debe mostrar "impuestos a calcular" hasta que se asigne una direccion.

- **las promociones se evaluan segun reglas de match policy**:
  - `all`: todas las reglas deben cumplirse
  - `any`: al menos una regla debe cumplirse
  
  el frontend no necesita implementar esta logica — el backend la resuelve.

- **el `outstandingBalance`** indica cuanto falta por pagar. es `max(0, total - paymentTotal)`. el frontend debe usarlo para determinar el monto del pago.

- **los montos de descuento son negativos** en `promo_total` y en los resultados de evaluacion de promociones.

- **el numero de orden** (`number`) es generado por el backend y no debe ser creado por el frontend. es el identificador visible para el usuario.
