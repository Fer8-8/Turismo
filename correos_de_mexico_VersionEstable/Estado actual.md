# Estado actual — Auditoría Arquitectónica

**Fecha:** 2025  
**Proyecto:** Correos de México — Backend  
**Stack:** NestJS 11 · Prisma 7 · GraphQL (Apollo) · EventEmitter2 · BetterAuth  
**Criterios evaluados:** Capas DDD, uso de facades, Prisma en infraestructura, lógica en resolvers, eventos asincrónicos, multi-tenancy, exports de módulos, excepciones custom, duplicidad de servicios, seguridad.

---

## ✅ Cumplimientos correctos

### 1. Módulo `location/` (Geography + Tax) — Referencia de arquitectura correcta

Los únicos módulos que implementan el patrón correctamente:

- `GeographyModule`: exporta solo `GeographyFacade`, no expone servicios internos (`CountryService`, `GeoStateService` son privados).
- `TaxModule`: exporta solo `TaxFacade`, servicios internos encapsulados.
- `LocationModule`: actúa de agregador limpio, re-exporta solo los submódulos.
- Los resolvers de geografía y tax delegan completamente a sus facades internas.
- Ambos modules importan solo `PrismaModule`, sin dependencias cruzadas.
- 183 tests cubriendo ambos dominios (69 geography, 114 tax).

### 2. Infraestructura de EventBus + Outbox

- `EventBusService` implementa el patrón Outbox correctamente: guarda en BD antes de emitir con `EventEmitter2`.
- `OutboxProcessor` procesa eventos pendientes cada 5 segundos con cron job.
- `OutboxService.markAsProcessed` y `markAsFailed` implementados correctamente.
- La persistencia garantiza at-least-once delivery ante caídas.
- Jerarquía de eventos correcta: `BaseEvent` → eventos de dominio.
- 9 eventos de dominio definidos (OrderCreated, InventoryReserved, PaymentAuthorized, etc.).

### 3. Infraestructura de StoreContext

- `@SkipStoreContext()` decorator implementado y funcional.
- `StoreContextGuard` valida header `x-store-id`, verifica existencia de tienda en BD, inyecta `storeContext` en request.
- Todos los resolvers que no requieren store usan `@SkipStoreContext()` de forma explícita.
- El guard usa excepciones custom (`MissingStoreIdException`, `UnauthorizedAccessException`).

### 4. Jerarquía de excepciones custom en `shared/`

- `AppException` base con código de error estructurado.
- `AppNotFoundException`, `AppConflictException`, `BusinessException`, `ValidationException`, `MissingStoreIdException`, `UnauthorizedAccessException`.
- La infraestructura existe. El problema es que la mayoría de los servicios no la usa (ver violaciones).

### 5. `SharedModule` como módulo global

- Registrado con `@Global()`, accesible en toda la aplicación sin importar.
- Registra `EventEmitter2` con wildcards habilitados.
- `ScheduleModule` integrado para el cron del OutboxProcessor.

### 6. `ProductModule` — encapsulación parcial correcta

- `exports: [ProductFacade]` — el módulo solo exporta la facade públicamente.
- `ProductFacade` existe y cubre productos, variantes, precios y la interfaz para ventas.
- Los servicios internos (`ProductService`, `VariantService`, `PriceService`) no están en `exports`.

---

## ⚠️ Riesgos arquitectónicos

### 7. `StoreContextGuard.validateUserStoreAccess` — stub con placeholder

**Archivo:** `src/core/shared/guards/store-context.guard.ts`

```ts
// PLACEHOLDER: Por ahora asume que todos los usuarios autenticados tienen acceso.
return true;
```

El método finge validar permisos pero siempre retorna `true`. Cualquier usuario autenticado con un `store_id` válido pasa la validación. El multitenancy está roto en la capa de autorización por usuario.

### 8. `AuthResolver.me` — mapeo manual de datos en resolver

**Archivo:** `src/core/auth/resolvers/auth.resolver.ts`

El resolver construye manualmente el objeto de respuesta mapeando campos de `user` y `session` en el handler de la query. Aunque es presentacional, este acoplamiento al shape del objeto pertenece a la capa de aplicación o a un mapper dedicado, no al resolver.

### 9. Doble módulo para el mismo recurso: `StateModule` vs `GeographyModule`

**Archivos:** `src/core/state/` y `src/location/geography/`

Ambos módulos acceden a las mismas tablas `prisma.state` y `prisma.country`. `StateService` y `GeoStateService` son esencialmente el mismo servicio duplicado. El `StateModule` sigue exportando `StateService` directamente. No está claro quién es la fuente de verdad para estados/países.

### 10. Módulos exportsando servicios internos en lugar de solo facades

Los siguientes módulos exportan su service interno además de (o en lugar de) la facade:

| Módulo | Exports incorrectos |
|--------|---------------------|
| `AddressModule` | `AddressService`, `AddressFacade` |
| `UserModule` | `UserService`, `UserFacade` |
| `AuthModule` | `AuthService`, `AuthFacade` |
| `StoreModule` | `StoreService`, `StoreFacade` |
| `StateModule` | `StateService`, `StateFacade` |

Exponer los servicios internos rompe la encapsulación: cualquier módulo importador puede saltarse la facade e inyectar el servicio directamente, que es exactamente lo que ocurre (ver violaciones críticas).

### 11. `StoreService` accede a tablas de otros dominios

**Archivo:** `src/core/store/services/store.service.ts`

Queries directas a:
- `prisma.productsStore` — inventario / catálogo
- `prisma.promotionsStore` — marketing / ventas
- `prisma.paymentMethodsStore` — pagos
- `prisma.taxCategories` — fiscal

El `StoreService` actúa como agregador de configuración de la tienda, pero lo hace accediendo directamente a tablas de 4 dominios distintos en lugar de usar facades de esos dominios. Funciona porque esos módulos no están implementados aún, pero es una deuda que deberá refactorizarse.

### 12. Eventos de dominio definidos pero sin listeners registrados

9 eventos definidos (`OrderCreatedEvent`, `InventoryReservedEvent`, `PaymentAuthorizedEvent`, etc.), `EventBusService` implementado, `OutboxProcessor` funcional. **Sin embargo, no existe ningún listener (`@OnEvent`) registrado en todo el codebase.** La infraestructura de eventos es infraestructura muerta: se acumula en Outbox pero nunca se procesa de forma reactiva porque nadie escucha. El `OutboxProcessor` emite los eventos en cron pero no hay quien los reciba.

---

## ❌ Violaciones críticas

### 13. Ausencia total de estructura de capas (DDD)

**Definido:** `domain/` → `application/` → `infrastructure/` → `presentation/`  
**Actual:** estructura plana — `service.ts` + `resolver.ts` + `facade.ts` en el mismo directorio.

Ningún módulo del sistema implementa la separación en capas. No existen directorios `domain/`, `application/`, `infrastructure/`, ni `presentation/` en ningún módulo. Todo el código de negocio, acceso a datos, presentación GraphQL y contratos públicos coexiste en el mismo nivel. La separación de capas es el fundamento de la arquitectura definida y no está implementada en ningún lugar salvo `location/` que lo hace implícitamente a través de servicios separados.

### 14. `UserService` — servicio dios que abarca 6+ dominios

**Archivo:** `src/core/user/user.service.ts`

Queries directas a tablas completamente ajenas al dominio de usuario:

```
prisma.address       → dominio Address
prisma.order         → dominio Sales / Fulfillment
prisma.creditCard    → dominio Payments
prisma.storeCredit   → dominio Payments / Promotions
prisma.role          → dominio Auth / IAM
prisma.roleUser      → dominio Auth / IAM
```

Métodos que no deberían existir en un UserService:
- `getUserAddresses()` — le pertenece a AddressFacade
- `getUserOrders()` — le pertenece a una SalesFacade
- `getUserCreditCards()` — le pertenece a PaymentsFacade
- `getUserStoreCredits()` — le pertenece a PromotionsFacade
- `assignRole()` / `removeRole()` / `getUserRoles()` — le pertenece a AuthFacade o un RoleService

Este servicio tiene visibilidad transaccional sobre al menos 4 dominios distintos. Cualquier cambio en Orders, Payments o Auth obliga a modificar UserService. Es acoplamiento máximo.

### 15. `AddressService` accede directamente a `prisma.state` y `prisma.country`

**Archivo:** `src/core/address/address.service.ts`

```ts
// Acceso cross-domain directo
const state = await this.prisma.state.findUnique({ where: { id: address.stateId } });
const country = await this.prisma.country.findUnique({ where: { id: address.countryId } });
```

El módulo de Address debe usar `GeographyFacade` o `StateFacade` para obtener estados y países. En cambio, accede directamente a las tablas del dominio Location/Geography, creando un acoplamiento oculto que no es visible en el grafo de dependencias de módulos.

### 16. `AddressResolver` importa entidades de otro módulo

**Archivo:** `src/core/address/address.resolver.ts`

```ts
import { State } from '../state/entities/state.entity';
import { Country } from '../state/entities/country.entity';
```

Un resolver de `core/address/` importa entidades de `core/state/`. Las entidades son artefactos internos de dominio; compartirlas entre módulos acopla las representaciones internas. Si el dominio state cambia sus entidades, address rompe.

Además, el tipo `AddressDeleteResult` está declarado como `@ObjectType()` directamente dentro del archivo del resolver, que es responsabilidad de la capa DTO/types.

### 17. `ProductResolver` inyecta servicios internos en lugar de la facade

**Archivo:** `src/catalog/product/product.resolver.ts`

```ts
constructor(
  private readonly productService: ProductService,
  private readonly variantService: VariantService,
  private readonly priceService: PriceService,
) {}
```

`ProductFacade` existe y está correctamente definida. El resolver la ignora e inyecta los 3 servicios internos directamente. La facade se exporta pero nunca se usa desde la presentación.

---

## 🔐 Violaciones de seguridad

### 18. Hash de contraseñas con SHA-256 — INSEGURO

**Archivo:** `src/core/account/account.service.ts`

```ts
const hashedPassword = input.password
  ? createHash('sha256').update(input.password).digest('hex')
  : undefined;
```

SHA-256 es una función de hash criptográfico de propósito general, **no una función de derivación de claves segura**. Es rápido por diseño, lo que lo hace vulnerable a ataques de fuerza bruta y rainbow tables en tasas de millones de intentos por segundo en hardware moderno.

El estándar de la industria para hash de contraseñas exige:
- **bcrypt** (factor de coste ≥ 10), o
- **argon2id** (recomendado OWASP), o  
- **scrypt**

La misma vulnerabilidad aplica en `updatePassword()`. Las contraseñas almacenadas en base de datos con SHA-256 están comprometidas si la base de datos es expuesta.

---

## 🔍 Sospechas de diseño cuestionable

### 19. Servicios usando excepciones de `@nestjs/common` en lugar de excepciones custom

La jerarquía de excepciones custom existe en `core/shared/exceptions/` pero la mayoría de servicios la ignora:

| Servicio | Excepción incorrecta usada |
|----------|---------------------------|
| `AddressService` | `NotFoundException` de NestJS |
| `UserService` | `NotFoundException`, `BadRequestException` de NestJS |
| `AccountService` | `NotFoundException`, `ConflictException` de NestJS |
| `SessionService` | `NotFoundException`, `ForbiddenException` de NestJS |
| `AuthService` | `UnauthorizedException` de NestJS |
| `StateService` | `NotFoundException` de NestJS |

Las excepciones custom del proyecto (como `AppNotFoundException`) añaden un código de error estructurado (`NOT_FOUND`, `CONFLICT`, etc.) que permite un manejo diferenciado en el cliente GraphQL. Usar las de NestJS directamente pierde esa interfaz de errores y mezcla la abstracción HTTP con la lógica de dominio.

### 20. `AuthResolver.me` — inline business logic

La query `me` en `auth.resolver.ts` construye inline el objeto de retorno, asignando campos con `(user as any).role ?? null`, `(user as any).banned ?? false`, etc. Esto es mapeo de datos con type-casting forzado directamente en el handler. Debe moverse a un mapper o al service.

### 21. `UserResolver` — ResolveFields llaman a métodos que cruzan dominios

`UserResolver` delega a `UserService`, que como se documentó en la violación 14, llama a `prisma.order`, `prisma.creditCard`, etc. La cadena es:

```
UserResolver.orders() 
  → userService.getUserOrders() 
    → prisma.order.findMany()  ← cross-domain
```

El resolver parece limpio (solo delega al service), pero el problema está en la cadena completa. La separación aparente es cosmética, no real.

### 22. `StoreContextGuard` inyecta `PrismaService` directamente

**Archivo:** `src/core/shared/guards/store-context.guard.ts`

El guard de la capa de presentación inyecta `PrismaService` y hace queries directas a `prisma.store` y `prisma.cdmUser`. Un guard es infraestructura transversal; debería usar `StoreFacade` para validar la tienda, no Prisma directamente. Si la lógica de validación de tienda cambia, hay que modificar el guard en lugar de el módulo de Store.

### 23. `AuthService` duplica lógica de `SessionService`

Tanto `AuthService` como `SessionService` tienen métodos para obtener sesiones por token, obtener sesiones activas del usuario y revocar sesiones. La lógica es materialmente idéntica. No existe separación clara de responsabilidades entre ambos servicios.

---

## 🧠 Evaluación general

### Resumen por dimensión

| Dimensión | Estado | Severidad |
|-----------|--------|-----------|
| Estructura de capas (DDD layers) | No implementada en ningún módulo | 🔴 CRÍTICO |
| Facades como única interfaz pública | Solo en `location/` y `ProductModule` exports | 🔴 CRÍTICO |
| Prisma solo en infraestructura | Violado en 5+ servicios con acceso cross-domain | 🔴 CRÍTICO |
| Lógica en resolvers | Parcialmente aceptable, mapeo inline en auth | 🟡 RIESGO |
| Eventos asincrónicos | Infraestructura completa pero sin listeners | 🟡 RIESGO |
| Multi-tenancy (StoreContext) | Guard implementado pero validación es stub | 🟡 RIESGO |
| God services | `UserService` abarca 6 dominios | 🔴 CRÍTICO |
| Módulos exportando internos | 5 módulos exponen servicio + facade | 🟡 RIESGO |
| Excepciones custom | Existentes pero ignoradas en casi todos los servicios | 🟡 RIESGO |
| Seguridad — hash de contraseñas | SHA-256 en `AccountService` | 🔴 CRÍTICO |
| Duplicidad de repositorios | `StateService` vs `GeoStateService` | 🟡 RIESGO |

### Diagnóstico honesto

El proyecto tiene una **arquitectura diseñada para el futuro** (facades, EventBus, Outbox, guards, custom exceptions, StoreContext) pero una **implementación anclada en el pasado** (servicios monolíticos, Prisma global, entidades compartidas entre módulos).

Hay una brecha de implementación seria: las abstracciones correctas están creadas (`ProductFacade`, `AddressFacade`, `UserFacade`, EventBus, Outbox), pero en la práctica se las puentea sistemáticamente. El módulo `location/` es la excepción que demuestra que el equipo sabe cómo hacerlo bien; el resto del codebase no aplica el mismo patrón.

**Los problemas más urgentes de atacar, en orden:**

1. **Seguridad** (SHA-256 en contraseñas) — riesgo de violación de datos.
2. **UserService** — descomponerlo en servicios de dominio. Es el mayor vector de acoplamiento actual.
3. **Validación real en StoreContextGuard** — el multitenancy está activo pero sin enforcement real.
4. **AddressService** — usar GeographyFacade para estados/países.
5. **ProductResolver** — usar ProductFacade en lugar de servicios directos.
6. **Estructura de capas** — migrar al esquema `domain/application/infrastructure/presentation/` módulo por módulo, empezando por uno de menor complejidad.
7. **Listeners de eventos** — sin listeners el Outbox es un acumulador de registros sin efecto.

La base técnica es sólida (NestJS + Prisma + GraphQL están bien configurados, los tests pasan), pero la disciplina de diseño DDD no está siendo aplicada consistentemente. El sistema puede crecer hacia deuda técnica acumulada si no se corrige antes de que entren los dominios faltantes (Financial, Fulfillment, Inventory, Postal, Commercial-Sales).
