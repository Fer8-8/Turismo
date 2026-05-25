# Store Module - Documentación Completa

## Descripción General

El módulo **Store** es el corazón del sistema multi-tenant parcial de Correos de México Backend. Se encarga de:

1. **Gestión de Tiendas**: Crear, leer, actualizar y desactivar tiendas
2. **Resolución de Contexto**: Determinar en qué tienda se está operando
3. **Validación de Acceso**: Verificar que una tienda existe y está activa
4. **Gestión de Recursos**: Vincular productos, promociones, métodos de pago y taxonomías a tiendas
5. **Configuración Regional**: Moneda, locale, país, y zona de checkout

---

## Arquitectura del Módulo

```
store/
├── entities/                 # GraphQL type definitions
│   └── store.entity.ts      # Entidad Store (fields + GraphQL decorators)
│
├── enums/
│   └── store-status.enum.ts # ACTIVE | INACTIVE
│
├── dtos/                     # Data Transfer Objects
│   ├── create-store.input.ts     # Input para crear tienda
│   ├── update-store.input.ts     # Input para actualizar
│   ├── store-filter.input.ts     # Filters para búsqueda
│   └── store-resources.dto.ts    # Responses (productos, promociones, etc)
│
├── services/
│   └── store.service.ts          # Business logic (40+ métodos)
│
├── resolvers/
│   └── store.resolver.ts         # GraphQL queries y mutations
│
├── facades/
│   └── store.facade.ts           # Acceso público desde otros módulos
│
├── store.module.ts           # NestJS module
├── index.ts                  # Exportaciones
└── STORE.md                  # Esta documentación
```

---

## Funcionalidades Implementadas

### 1. Gestión de Tiendas (CRUD)

**Métodos de StoreService:**

```typescript
// CREATE
await storeService.createStore(input)
  // Valida unicidad de código
  // Retorna Store completo

// READ
await storeService.getStoreById(storeId)      // Por ID
await storeService.getStoreByCode(code)       // Por código

// LIST
await storeService.listStores(filter?, skip, take)
  // Filtros: code, name, is_active, search
  // Retorna: { stores, total }

// UPDATE
await storeService.updateStore(storeId, input)
  // Campos parciales
  // Valida código si cambia

// DEACTIVATE/ACTIVATE
await storeService.toggleStoreStatus(storeId, isActive)
```

### 2. Configuración General de Tienda

**Campos almacenados:**

- `name` - Nombre display
- `code` - Identificador único (UNIQUE constraint)
- `url` - Dominio/website
- `default_currency` - Moneda por defecto (ej: MXN)
- `default_locale` - Locale por defecto (ej: es-MX)
- `customer_support_email` - Email soporte
- `new_order_notifications_email` - Email notificaciones ordenes
- `mail_from_address` - Email remitente
- `address` - Dirección física
- `contact_phone` - Teléfono contacto
- `default_country_id` - País asociado
- `checkout_zone_id` - Zona de cobertura

### 3. Resolución de Tienda por Contexto

```typescript
// Busca tienda por ID o código
await storeService.resolveStore(storeId?, code?)

// GraphQL queries (todas skip StoreContext):
query {
  store(id: "...") { name, code, is_active }
  storeByCode(code: "MX") { ... }
  stores(filter: {}, skip: 0, take: 10) { items, totalCount, hasMore }
}
```

### 4. Validación de Acceso

```typescript
// Validar que tienda existe y está activa
await storeService.validateStoreAccess(storeId)
  // Lanza AppNotFoundException si no existe
  // Lanza BusinessException si no está activa

// Validaciones individuales
await storeService.validateStoreExists(storeId)    // boolean
await storeService.validateStoreIsActive(storeId)  // boolean
```

### 5. Recursos Habilitados por Tienda

```typescript
// PRODUCTOS
await storeService.getEnabledProductsForStore(storeId)
  // Retorna: { store_id, product_ids[], product_count }

// PROMOCIONES
await storeService.getEnabledPromotionsForStore(storeId)
  // Retorna: { store_id, promotion_ids[], promotion_count }

// MÉTODOS DE PAGO
await storeService.getEnabledPaymentMethodsForStore(storeId)
  // Retorna: { store_id, payment_method_ids[], payment_method_count }

// TAXONOMÍAS
await storeService.getEnabledTaxonomiesForStore(storeId)
  // Retorna: { store_id, taxonomy_ids[], taxonomy_count }
```

### 6. Asociación Productos ↔ Tienda

```typescript
// Asignar producto a tienda
await storeService.assignProductToStore(storeId, productId)

// Desasignar
await storeService.unassignProductFromStore(storeId, productId)

// Validar disponibilidad
await storeService.isProductAvailableInStore(storeId, productId)  // boolean

// Obtener todas las tiendas de un producto
await storeService.getStoresForProduct(productId)  // string[]
```

### 7. Asociación Promociones ↔ Tienda

```typescript
// Asignar promoción a tienda
await storeService.assignPromotionToStore(storeId, promotionId)

// Desasignar
await storeService.unassignPromotionFromStore(storeId, promotionId)

// Validar si aplica
await storeService.isPromotionAppliedToStore(storeId, promotionId)  // boolean
```

### 8. Asociación Métodos de Pago ↔ Tienda

```typescript
// Asignar método
await storeService.assignPaymentMethodToStore(storeId, paymentMethodId)

// Desasignar
await storeService.unassignPaymentMethodFromStore(storeId, paymentMethodId)

// Validar
await storeService.isPaymentMethodEnabledInStore(storeId, paymentMethodId)
```

### 9. Asociación Taxonomías ↔ Tienda

```typescript
// Obtener taxonomías de tienda
await storeService.getTaxonomiesForStore(storeId)  // string[]

// Validar pertenencia
await storeService.isTaxonomyAssociatedWithStore(storeId, taxonomyId)  // boolean
```

### 10. Configuración Zona de Checkout

```typescript
// Obtener zona
await storeService.getCheckoutZoneForStore(storeId)  // string | null

// Establecer zona
await storeService.setCheckoutZoneForStore(storeId, checkoutZoneId)
```

### 11. Validación País y Config Regional

```typescript
// Obtener config regional de tienda
await storeService.getStoreRegionalConfiguration(storeId)
  // Retorna: {
  //   store_id, name, code, is_active,
  //   default_currency, default_locale, default_country_id,
  //   checkout_zone_id, customer_support_email,
  //   created_at, updated_at
  // }
```

### 12. Facade Pública

```typescript
// StoreFacade proporciona interfaz simplificada para otros módulos:
import { StoreFacade } from '@core/store'

constructor(private storeFacade: StoreFacade) {}

// Métodos principales (no requieren DDD knowledge):
await storeFacade.getStoreById(storeId)
await storeFacade.validateStoreAccess(storeId)
await storeFacade.getProductsForStore(storeId)  // string[]
await storeFacade.getPaymentMethodsForStore(storeId)  // string[]
await storeFacade.getRegionalConfiguration(storeId)
```

---

## GraphQL Queries y Mutations

### Queries

```graphql
# Obtener tienda por ID
query {
  store(id: "550e8400-e29b-41d4-a716-446655440000") {
    id
    name
    code
    is_active
    default_currency
    default_locale
  }
}

# Obtener tienda por código
query {
  storeByCode(code: "MX") {
    id
    name
  }
}

# Listar tiendas con paginación
query {
  stores(filter: {is_active: true}, skip: 0, take: 10) {
    items {
      id
      name
      code
    }
    totalCount
    hasMore
  }
}

# Productos habilitados
query {
  storeProducts(storeId: "...") {
    store_id
    product_ids
    product_count
  }
}

# Configuración regional
query {
  storeConfiguration(storeId: "...") {
    name
    code
    default_currency
    default_locale
    default_country_id
  }
}
```

### Mutations

```graphql
# Crear tienda
mutation {
  createStore(input: {
    name: "Tienda México"
    code: "MX"
    default_currency: "MXN"
    default_locale: "es-MX"
    customer_support_email: "support@example.com"
  }) {
    id
    name
    code
    is_active
  }
}

# Actualizar tienda
mutation {
  updateStore(id: "...", input: {
    name: "Nueva nombre"
    is_active: true
  }) {
    id
    name
  }
}

# Activar/Desactivar tienda
mutation {
  activateStore(id: "...")   { id, is_active }
  deactivateStore(id: "...") { id, is_active }
}

# Asignar producto a tienda
mutation {
  assignProductToStore(storeId: "...", productId: "...") # boolean
}

# Asignar promoción a tienda
mutation {
  assignPromotionToStore(storeId: "...", promotionId: "...") # boolean
}

# Asignar método de pago a tienda
mutation {
  assignPaymentMethodToStore(storeId: "...", paymentMethodId: "...") # boolean
}
```

---

## Integración con Otros Módulos

### Desde un otro módulo (ej: Catalog, Commercial-Sales):

```typescript
// 1. Inyectar la facade
import { StoreFacade } from '@core/store'

constructor(private storeFacade: StoreFacade) {}

// 2. Usar en tu lógica
async handleProductRequest(storeId: string, productId: string) {
  // Validar que tienda existe y está activa
  await this.storeFacade.validateStoreAccess(storeId)

  // Verificar que producto está en tienda
  const isAvailable = await this.storeFacade.isProductAvailableInStore(
    storeId,
    productId
  )
  if (!isAvailable) {
    throw new BusinessException('Product not available in this store')
  }

  // Obtener configuración regional
  const config = await this.storeFacade.getRegionalConfiguration(storeId)
  console.log(`Store currency: ${config.default_currency}`)

  // Continuar con lógica del módulo...
}
```

### En Guards o Interceptors:

```typescript
// StoreContextGuard ya valida automáticamente
// pero puedes usar la facade para operaciones adicionales

async canActivate(context: ExecutionContext) {
  // ... existing guard logic ...
  
  // Validar que tienda tiene algún recurso habilitado
  const products = await this.storeFacade.getProductsForStore(storeId)
  if (products.length === 0) {
    throw new BusinessException('Store has no products')
  }
  
  return true
}
```

---

## Reglas de Negocio

1. **Código Único**: El campo `code` de cada tienda debe ser único (UNIQUE constraint en BD)
2. **Tienda Activa**: Antes de operar en una tienda, validar mediante `validateStoreAccess()`
3. **Multi-tenant Parcial**: No todos los recursos son por tienda, algunos son globales
4. **Relaciones Pivote**: Productos, promociones, pagos, taxonomías se vinculan via tablas pivote

---

## Testing

### Casos de prueba principales:

```typescript
// 1. CRUD
describe('Store CRUD', () => {
  it('should create store with unique code')
  it('should throw if code already exists')
  it('should get store by id')
  it('should get store by code')
  it('should list stores with filters')
  it('should update store')
  it('should toggle store status')
})

// 2. Validación
describe('Store Validation', () => {
  it('should validate store exists')
  it('should validate store is active')
  it('should throw if store not active')
})

// 3. Recursos
describe('Store Resources', () => {
  it('should assign product to store')
  it('should check product availability')
  it('should list store products')
  it('should assign promotion to store')
  it('should validate payment method enabled')
})

// 4. GraphQL
describe('Store Resolver', () => {
  it('should resolve store query')
  it('should create store mutation')
  it('should list stores with pagination')
  it('should handle filter parameters')
})
```

---

## Próximos Pasos

1. **Implementar Listeners**: Crear listeners para eventos de Store (StoreCreated, StoreActivated, etc)
2. **Audit Log**: Registrar cambios en tiendas para auditoría
3. **Webhooks**: Enviar webhooks cuando tienda  se crea/actualiza
4. **Cache**: Implementar caching de configuración regional
5. **Sync con otros módulos**: Asegurar que otros dominios usa StoreFacade correctamente

---

## Notas de Desarrollo

- **PrismaService**: Inyectado en StoreService, no en Store Module directamente
- **Facade**: Siempre usar StoreFacade desde otros módulos, no StoreService directo
- **Validaciones**: Usar AppNotFoundException y BusinessException del shared module
- **GraphQL**: Todos los resolvers usan `@SkipStoreContext()` porque Store es sistema
