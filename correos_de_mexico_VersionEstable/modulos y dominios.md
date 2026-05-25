
## tabla de contenidos

1. [estructura general](#estructura-general)
2. [módulos por prioridad](#módulos-por-prioridad)
3. [especificación detallada por módulo](#especificación-detallada-por-módulo)
4. [dependencias entre módulos](#dependencias-entre-módulos)
5. [patrones implementación](#patrones-implementación)
6. [checklist de implementación](#checklist-de-implementación)

---

## estructura general

### total de módulos: 19
- **existentes (8)**: auth, user, account, session, address, state, product, prisma
- **nuevos (11)**: shared, store, geography, catalog, asset, inventory, sales, payments, fulfillment, marketing, postal

### total de modelos prisma: 86
- **mapeados a módulos**: 83 modelos
- **globales sin módulo específico**: 3 (tracker, logentry, preference - viven en shared)

### patrón arquitectónico
- **event-driven asincrónico** con outbox pattern
- **store-scoped** (multi-tenancy parcial)
- **facade pattern** (1 por módulo, única exportación pública)
- **application services** (orquestación síncrona)
- **graphql-first** (no rest)

---

## módulos por prioridad

### prioridad 1 - crítica (bloqueantes)

#### 1. módulo: shared
**estado**: nuevo
**fase**: fase 0
**criticidad**: crítica (requerida por todos)

**responsabilidades**:
- event bus infrastructure (pub/sub)
- outbox pattern implementation
- store context management
- exception hierarchy
- validators reutilizables
- graphql scalars

**modelos prisma asociados**:
- outboxevent (a crear - migration necesaria)
- statechange (soporte para state machines)
- tracker (global)
- logentry (global)
- preference (global)

**dependencias**: ninguna (base)

**emite eventos**: ninguno (solo infraestructura)

**escucha eventos**: ninguno (infraestructura)

---

#### 2. módulo: store
**estado**: nuevo
**fase**: fase 0
**criticidad**: crítica (multi-tenancy core)

**responsabilidades**:
- crud de store (empresa/sucursal)
- crédito de tienda (gift cards, saldo)
- relación store ↔ user
- soft delete de stores

**modelos prisma asociados**:
- store
- storecredit
- storecreditcategory
- storecredittype
- storecreditevent

**dependencias**: shared (guards, exceptions)

**emite eventos**: ninguno

**escucha eventos**: ninguno

---

#### 3. módulo: product
**estado**: existente parcial (refactor necesario)
**fase**: fase 1
**criticidad**: crítica (datos fundamentales)

**responsabilidades**:
- crud de product (artículo)
- crud de variant (variante: color, talla, etc.)
- crud de price (precios)
- opciones de producto (talla, color, etc.)
- propiedades técnicas (peso, dimensiones, etc.)
- prototipos (templates)

**modelos prisma asociados**:
- product
- variant
- price
- optiontype
- optionvalue
- optionvaluevariant
- productoptiontype
- property
- productproperty
- prototype
- optiontypeprototype
- propertyprototype
- friendlyidslug

**dependencias**: shared (exceptions, validators)

**emite eventos**: ninguno (consulta pura)

**escucha eventos**: ninguno

---

#### 4. módulo: geography
**estado**: nuevo
**fase**: fase 2
**criticidad**: crítica (datos de envío)

**responsabilidades**:
- crud de country (país)
- crud de state (estado/provincia)
- crud de zone (zonas de cobertura postal)
- relaciones de zonas

**modelos prisma asociados**:
- country
- state
- zone
- zonemember

**dependencias**: shared (exceptions)

**emite eventos**: ninguno

**escucha eventos**: ninguno

---

### prioridad 2 - alta (core de negocio)

#### 5. módulo: catalog
**estado**: nuevo
**fase**: fase 1
**criticidad**: alta (navegación de tienda)

**responsabilidades**:
- taxonomía de productos (categorías jerárquicas)
- gestión de categorías (taxon)
- propiedades de producto por categoría

**modelos prisma asociados**:
- taxonomy (store_id)
- taxon (categoría, jerarquía)
- productstaxon (pivot)

**dependencias**: shared (exceptions, guards), product (consulta de productos)

**emite eventos**: ninguno

**escucha eventos**: ninguno

---

#### 6. módulo: asset
**estado**: nuevo
**fase**: fase 1
**criticidad**: alta (imágenes/attachments)

**responsabilidades**:
- almacenamiento de archivos (imágenes, documentos)
- urls públicas de assets
- relación genérica (viewable_type/viewable_id)
- soporte s3 o local storage

**modelos prisma asociados**:
- asset (sin store_id - global)

**dependencias**: shared (exceptions)

**emite eventos**: ninguno

**escucha eventos**: ninguno

---

#### 7. módulo: inventory
**estado**: nuevo
**fase**: fase 3
**criticidad**: alta (control de stock)

**responsabilidades**:
- registro de ubicaciones de stock (almacenes)
- items de stock por variante y ubicación
- movimientos de stock (auditoría)
- transferencias entre ubicaciones
- reservas de stock (pre-compra)

**modelos prisma asociados**:
- stocklocation (sin store_id - global)
- stockitem (cantidad disponible)
- stockmovement (auditoría, append-only)
- stocktransfer (transferencias entre ubicaciones)
- inventoryunit (reservas asociadas a order)

**dependencias**: shared (exceptions, events), product (acceso a variantes)

**emite eventos**: ninguno (escucha)

**escucha eventos**:
- ordercreatedevent → reservar stock (con retry b+c)
- ordercancelledevent → liberar stock

---

#### 8. módulo: marketing
**estado**: nuevo
**fase**: fase 4
**criticidad**: alta (promociones en checkout)

**responsabilidades**:
- crud de promociones
- reglas de aplicación (condiciones)
- acciones de promoción (descuentos, envío gratis)
- cálculo de descuentos en checkout (síncrono)

**modelos prisma asociados**:
- promotion (sin store_id en tabla, pero relación indirecta)
- promotioncategory
- promotionaction (descuento %, envío gratis, etc.)
- promotionactionlineitem
- promotionrule
- productpromotionrule
- promotionruleuser
- orderpromotion
- promotionsstore

**dependencias**: shared (exceptions, guards), product (consulta de productos)

**emite eventos**: ninguno

**escucha eventos**: ninguno

---

#### 9. módulo: sales
**estado**: nuevo
**fase**: fase 5
**criticidad**: alta (core del negocio)

**responsabilidades**:
- crud de order (pedido/carrito)
- lineitem (items del pedido)
- adjustment (ajustes: envío, descuentos, impuestos)
- orquestación síncrona de checkout (ordercreationappservice)
- emisión del evento ordercreatedevent

**modelos prisma asociados**:
- order (store_id directo)
- lineitem
- adjustment

**dependencias**: shared (exceptions, events, guards), product (consulta de variantes/precios), geography (validar dirección), inventory (validar stock disponible), marketing (aplicar descuentos)

**emite eventos**:
- ordercreatedevent → dispara listeners async (payments, fulfillment, inventory)

**escucha eventos**: ninguno

---

### prioridad 3 - media (completar flujo)

#### 10. módulo: payments
**estado**: nuevo
**fase**: fase 6
**criticidad**: media (procesamiento de pagos)

**responsabilidades**:
- crud de método de pago
- crud de datos de tarjeta
- procesamiento de pagos con gateway (stripe, paypal, etc.)
- autorización y captura de fondos
- reembolsos

**modelos prisma asociados**:
- paymentmethod
- paymentmethodsstore (pivot)
- payment (indirecto por order_id)
- paymentcaptureevent
- creditcard
- refundreason
- refund (indirecto por payment_id)
- gateway

**dependencias**: shared (exceptions, events, guards), sales (relación a order)

**emite eventos**:
- paymentauthorizedevent (cuando authorization es exitosa)
- paymentcapturedevent (cuando captura es exitosa)

**escucha eventos**:
- ordercreatedevent → crear payment pendiente

---

#### 11. módulo: fulfillment
**estado**: nuevo
**fase**: fase 7
**criticidad**: media (cumplimiento de pedidos)

**responsabilidades**:
- crud de shipment (envío)
- crud de returnauthorization (devoluciones)
- crud de reimbursement (reembolsos operacionales)
- gestión de returnitem (items devueltos)
- separación de reimbursement vs refund

**modelos prisma asociados**:
- shipment (indirecto por order_id)
- shippingmethod
- shippingrate
- shippingcategory
- shippingmethodcategory
- returnauthorization (indirecto por order_id)
- returnauthorizationreason
- returnitem
- customerreturn
- reimbursement (store_id directo o indirecto por order_id)
- reimbursementtype
- reimbursementcredit

**dependencias**: shared (exceptions, events, guards), sales (relación a order), payments (para reembolsos financieros), geography (validar dirección de devolución)

**emite eventos**:
- shipmentshippedevent (para postal)
- returnapprovedevent (para reembolsos)
- shipmentdeliveredevent (informativo)

**escucha eventos**:
- ordercreatedevent → crear shipment pendiente
- paymentcapturedevent → marcar shipment ready

---

#### 12. módulo: postal
**estado**: nuevo
**fase**: fase 8
**criticidad**: media (integración con correos)

**responsabilidades**:
- integración con correos de méxico (api)
- creación de guías postales
- manifiestos de envío
- rastreo de eventos (append-only log)
- asignación de vehículos de envío

**modelos prisma asociados**:
- postaloffice
- postalguide (sin store_id)
- postalmanifest (sin store_id)
- postalmanifestguide (pivot)
- postalvehicle (sin store_id)
- postalevent (append-only, sin store_id)
- postalofficeventrule

**dependencias**: shared (exceptions, events), fulfillment (relación a shipment)

**emite eventos**:
- postguidecreatedevent (informativo)
- postaleventriceivedevent (cuando llega webhook de correos)

**escucha eventos**:
- shipmentshippedevent → crear guía postal

---

### prioridad 4 - baja (existentes/support)

#### 13. módulo: auth
**estado**: existente (review)
**fase**: fase 0
**criticidad**: baja (ya existe, integrado con betterauth)

**responsabilidades**:
- integración betterauth
- gestión de sesiones jwt
- control de roles (role, roleuser)

**modelos prisma asociados**:
- user (betterauth)
- session (betterauth)
- account (betterauth)
- verification (betterauth)
- role (custom)
- roleuser (custom)

**a hacer**:
- revisar integración betterauth
- jwt con store_ids array (para multi-tenancy)
- roleuser para permisos granulares

---

#### 14. módulo: user
**estado**: existente (refactor)
**fase**: fase 0
**criticidad**: baja

**responsabilidades**:
- perfil de usuario (cdmuser - usuario de negocio)
- soft delete

**modelos prisma asociados**:
- cdmuser

**a hacer**:
- refactor: exportar userfacade
- soft delete

---

#### 15. módulo: address
**estado**: existente (refactor)
**fase**: fase 0
**criticidad**: baja

**responsabilidades**:
- dirección de usuario/shipping
- soft delete

**modelos prisma asociados**:
- address

**a hacer**:
- refactor: exportar addressfacade
- separar country/state a geography module
- soft delete

---

#### 16. módulo: session
**estado**: existente (review)
**fase**: fase 0
**criticidad**: baja

**responsabilidades**:
- gestión de sesiones (betterauth)

**a hacer**:
- revisar invalidación correcta
- soft delete (si aplica)

---

#### 17. módulo: account
**estado**: existente (refactor)
**fase**: fase 0
**criticidad**: baja

**responsabilidades**:
- gestión de cuentas (betterauth)

**a hacer**:
- refactor: exportar accountfacade

---

#### 18. módulo: state
**estado**: existente (refactor)
**fase**: fase 0
**criticidad**: baja

**responsabilidades**:
- auditoría de cambios de estado
- statechange (append-only log)

**modelos prisma asociados**:
- statechange

**a hacer**:
- refactor: exportar statemachinefacade
- statechangeservice para auditar transiciones

---

#### 19. módulo: prisma
**estado**: existente (update)
**fase**: fase 0
**criticidad**: baja

**responsabilidades**:
- proveedor orm (prismaservice)
- outbox table

**a hacer**:
- revisar prismaservice
- agregar outboxevent model a schema.prisma
- migration para outbox table

---

## dependencias entre módulos

```
shared (base, ninguna dependencia)
  ↓
  ├→ store
  ├→ product
  ├→ geography
  ├→ inventory (+ product)
  ├→ catalog (+ product)
  ├→ asset
  ├→ marketing (+ product)
  ├→ sales (+ product, geography, inventory, marketing)
  ├→ payments (+ sales)
  ├→ fulfillment (+ sales, payments, geography)
  └→ postal (+ fulfillment)

auth, user, address, session, account, state, prisma
  ↓
  dependencias internas (refactors menores)
```

---

## patrones implementación

### 1. facade pattern

cada módulo exporta una clase facade

### 2. application service pattern

para orquestación síncrona

### 3. event listener pattern

para reacciones asincrónicas

### 4. store context guard

para extraer y validar multi-tenancy

### 5. soft delete pattern

para registros eliminables

---

## checklist de implementación

- [ ] shared
- [ ] store
- [ ] product refactor
- [ ] geography
- [ ] catalog
- [ ] asset
- [ ] inventory
- [ ] marketing
- [ ] sales
- [ ] payments
- [ ] fulfillment
- [ ] postal
- [ ] auth review
- [ ] user refactor
- [ ] address refactor
- [ ] session review
- [ ] account refactor
- [ ] state refactor
- [ ] prisma update

---


