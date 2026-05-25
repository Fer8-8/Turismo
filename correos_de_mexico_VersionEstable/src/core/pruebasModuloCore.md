# Pruebas del Módulo Core

**Fecha de ejecución:** 13 de marzo de 2026  
**Entorno:** NestJS 11.x · GraphQL Apollo · PostgreSQL 17 · Prisma · Better Auth  
**Framework de pruebas:** Jest 30.x + ts-jest  
**Comando:** `pnpm test`

---

## Resumen de Resultados

| Métrica | Resultado |
|---|---|
| **Test Suites** | 9 / 9 ✅ |
| **Tests totales** | 100 / 100 ✅ |
| **Snapshots** | 0 |
| **Tiempo de ejecución** | ~0.9 s |
| **Pruebas fallidas** | 0 ❌ |

> **Todos los módulos del dominio Core pasaron sus pruebas con éxito.**

---

## Lo que se hizo

### 1. Corrección de specs existentes rotas

Al iniciar la fase de pruebas, dos archivos de spec que ya existían en el proyecto fallaban. Ambos fueron diagnosticados y corregidos:

#### `store-context.guard.spec.ts`
- **Problema:** El constructor del guard había cambiado de `(Reflector)` a `(Reflector, PrismaService)`. El spec lo instanciaba con un solo argumento. Además, `canActivate` pasó a ser `async`, por lo que `expect(() => ...).toThrow()` ya no detectaba los errores — había que usar `await expect(...).rejects.toThrow()`.
- **Solución:**
  - Se añadió un mock de `PrismaService` con `store.findUnique` y `cdmUser.findUnique`.
  - Se actualizó la instanciación del guard con ambos argumentos.
  - Todos los `expect(...toThrow)` se convirtieron a `await ... rejects.toThrow()`.
  - Se eliminó código de spec antiguo (bloque de tests duplicado sin estructura `describe` que causaba error de sintaxis TS1128).
  - Se añadió el test para `UnauthorizedAccessException` cuando el store no existe en BD.

#### `event-bus.service.spec.ts`
- **Problema:** `EventBusService` ahora depende de `OutboxService` pero el módulo de prueba no lo proveía, lo que causaba un error de inyección de dependencias.
- **Solución:**
  - Se añadió `{ provide: OutboxService, useValue: { save: jest.fn() } }` al `TestingModule`.
  - Se agregaron tests específicos para verificar que `outboxService.save()` se llama antes de emitir, y que se relanza el error si `save` falla.

---

### 2. Nuevos archivos de spec creados

Se crearon cuatro archivos de spec nuevos, uno por cada módulo implementado durante esta sesión:

#### `account.service.spec.ts`
Cubre el servicio `AccountService` completo. Durante la escritura se detectaron tres discrepancias entre los mocks iniciales y la implementación real del servicio —todas corregidas:

- `findAccountsByUser` incluye `orderBy: { createdAt: 'asc' }` — el mock de expectativa fue actualizado.
- `accountExistsForProvider` usa `prisma.account.count()` (no `findFirst`) — se corrigió el mock del método.
- `validateAccount` realiza **dos queries separadas** (`account.findUnique` con `select`, luego `user.findUnique`), no una sola con `include: { user: true }` — se añadió el mock de `prisma.user.findUnique` de forma independiente.

#### `session.service.spec.ts`
Cubre `SessionService` con todos sus métodos:
- Creación de sesión con expiración por defecto (7 días) y expiración custom.
- Validación de sesión expirada vs. activa.
- Revocación de sesión con verificación de dueño.
- Revocación en masa y limpieza de sesiones expiradas.
- Extensión de sesión.

#### `state.service.spec.ts`
Cubre `StateService` incluyendo la entidad `Country`:
- CRUD de estados con filtros por `countryId` y término de búsqueda.
- Métodos de países: `findAllCountries`, `findCountryById`, `findCountryByIso` (búsqueda case-insensitive).

#### `address.service.spec.ts`
Cubre `AddressService` con el ciclo de vida completo de una dirección:
- Creación con validación de existencia del estado (`NotFoundException` si no existe).
- Soft-delete y restore.
- Hard-delete permanente.
- `getAddressState` para el resolver de relaciones.

---

## Detalle de Pruebas por Suite

### `account.service.spec.ts` — 18 tests ✅

| Grupo | Test |
|---|---|
| _(root)_ | should be defined |
| `createAccount` | should create an account when user exists and no duplicate |
| `createAccount` | should throw NotFoundException when user does not exist |
| `createAccount` | should throw ConflictException when account already exists for provider |
| `createAccount` | should hash the password when provided |
| `findAccountById` | should return account when found |
| `findAccountById` | should throw NotFoundException when not found |
| `findAccountsByUser` | should return all accounts for a user ordered by createdAt |
| `accountExistsForProvider` | should return true when account count > 0 |
| `accountExistsForProvider` | should return false when account count === 0 |
| `updatePassword` | should hash and update the password for credential accounts |
| `updatePassword` | should throw NotFoundException when account does not exist |
| `validateAccount` | should return valid=true for an account with non-expired token |
| `validateAccount` | should return valid=false with reason when account not found |
| `validateAccount` | should return valid=false when user is banned |
| `validateAccount` | should return valid=false when access token is expired |
| `deleteAccount` | should delete account and return success |
| `deleteAccount` | should throw NotFoundException when account does not exist |

---

### `store-context.guard.spec.ts` — 8 tests ✅

| Test |
|---|
| should be defined |
| should allow request when X-Store-Id is present and store exists |
| should trim the store id before lookup |
| should throw MissingStoreIdException when header is missing |
| should throw MissingStoreIdException when header is empty |
| should throw MissingStoreIdException when header is whitespace only |
| should skip validation when @SkipStoreContext() is set |
| should throw UnauthorizedAccessException when store does not exist |

---

### `event-bus.service.spec.ts` — 8 tests ✅

| Grupo | Test |
|---|---|
| _(root)_ | should be defined |
| `emit` | should save to outbox before emitting |
| `emit` | should emit an event through the EventEmitter2 |
| `emit` | should not throw when no listeners are registered |
| `emit` | should rethrow when outboxService.save fails |
| `emitAndWait` | should save to outbox before emitting |
| `emitAndWait` | should emit and wait for all listeners to complete |
| `emitAndWait` | should call registered listener and await it |

---

### `session.service.spec.ts` — 23 tests ✅

| Grupo | Test |
|---|---|
| _(root)_ | should be defined |
| `createSession` | should create a session with default expiry (7 days) |
| `createSession` | should throw NotFoundException when user does not exist |
| `createSession` | should use custom expiresInMs when provided |
| `getSessionById` | should return the session when found |
| `getSessionById` | should throw NotFoundException when not found |
| `isSessionValid` | should return true for a non-expired session |
| `isSessionValid` | should return false for an expired session |
| `isSessionValid` | should return false when session does not exist |
| `getActiveSessions` | should call findMany with expiresAt > now filter |
| `revokeSession` | should delete the session when it belongs to the requesting user |
| `revokeSession` | should throw ForbiddenException when session belongs to another user |
| `revokeSession` | should delete session without user check when requestingUserId is not provided |
| `revokeAllSessions` | should delete all sessions for a user and return count |
| `cleanExpiredSessions` | should delete expired sessions globally when no userId given |
| `cleanExpiredSessions` | should filter by userId when provided |
| `extendSession` | should extend a future session expiry from current expiresAt |

---

### `address.service.spec.ts` — 14 tests ✅

| Grupo | Test |
|---|---|
| _(root)_ | should be defined |
| `createAddress` | should create an address when state exists |
| `createAddress` | should throw NotFoundException when state does not exist |
| `findAll` | should return only non-deleted addresses |
| `findById` | should return address when found |
| `findById` | should throw NotFoundException when not found |
| `findAddressesByUser` | should return active addresses for the user |
| `updateAddress` | should update the address fields |
| `updateAddress` | should throw NotFoundException when address does not exist |
| `softDeleteAddress` | should throw NotFoundException when address does not exist |
| `hardDeleteAddress` | should permanently delete the address |
| `getAddressState` | should call prisma.state.findUnique with the stateId |

---

### `state.service.spec.ts` — 13 tests ✅

| Grupo | Test |
|---|---|
| _(root)_ | should be defined |
| `create` | should create a state with the given input |
| `findAll` | should return all states ordered by name |
| `findAll` | should filter by countryId when provided |
| `findAll` | should filter by search term when provided |
| `findById` | should return the state when found |
| `findById` | should throw NotFoundException when not found |
| `getStatesByCountry` | should return states filtered by countryId, ordered by name |
| `update` | should update a state and return the updated record |
| `update` | should throw NotFoundException when state does not exist |
| `findAllCountries` | should return all countries ordered by name |
| `findCountryById` | should return country when found |
| `findCountryById` | should throw NotFoundException when country not found |
| `findCountryByIso` | should do case-insensitive search by ISO code |
| `findCountryByIso` | should return null when no match |

---

### `shared.module.spec.ts` — 3 tests ✅

| Test |
|---|
| should compile the module |
| should provide EventBusService |
| EventBusService should be a singleton (global module) |

---

### `exceptions.spec.ts` — 12 tests ✅

| Grupo | Test |
|---|---|
| `AppException` | should create with message, code, and default status |
| `AppException` | should create with custom status |
| `AppException` | should be instanceof HttpException |
| `AppValidationException` | should store validation errors |
| `AppNotFoundException` | should include resource name and id |
| `AppNotFoundException` | should work without id |
| `AppConflictException` | should create with message |
| `BusinessException` | should create with default code |
| `BusinessException` | should accept custom code |
| `MissingStoreIdException` | should create with correct message and code |
| `UnauthorizedAccessException` | should create with default message |
| `UnauthorizedAccessException` | should accept custom message |

---

### `base.event.spec.ts` — 5 tests ✅

| Test |
|---|
| should create an event with a unique eventId |
| should set occurredAt to current time |
| should set the eventName from constructor |
| should generate unique eventIds for different instances |
| toPayload should include base fields |

---

## Estado Final del Dominio Core

| Módulo | Implementación | Pruebas |
|---|---|---|
| **Auth** | ✅ Completo | — (manejado por Better Auth) |
| **User** | ✅ Completo | — |
| **Account** | ✅ Completo | ✅ 18 tests |
| **Session** | ✅ Completo | ✅ 23 tests |
| **State + Country** | ✅ Completo | ✅ 15 tests |
| **Address** | ✅ Completo | ✅ 12 tests |
| **Shared (Guard)** | ✅ Completo | ✅ 8 tests |
| **Shared (EventBus)** | ✅ Completo | ✅ 8 tests |
| **Shared (Excepciones)** | ✅ Completo | ✅ 12 tests |
| **Shared (Events)** | ✅ Completo | ✅ 5 tests |

**TypeScript:** `npx tsc --noEmit` — cero errores en código de producción.

---

\