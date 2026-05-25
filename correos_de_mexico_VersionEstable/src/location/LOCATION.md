# Dominio Location

Dominio responsable de toda la información geográfica y fiscal del sistema. Contiene dos submódulos: **Geography** y **Tax**.

Registrado en `AppModule` a través de `LocationModule`, que importa y re-exporta ambos submódulos.

---

## Estructura

```
src/location/
├── location.module.ts            # Módulo raíz del dominio
├── LOCATION.md                   # Este archivo
├── geography/                    # Submódulo de geografía
│   ├── geography.module.ts
│   ├── geography.resolver.ts
│   ├── country.service.ts
│   ├── state.service.ts
│   ├── index.ts
│   ├── entities/
│   │   ├── country.entity.ts
│   │   ├── state.entity.ts
│   │   └── index.ts
│   ├── dto/
│   │   ├── create-country.input.ts
│   │   ├── update-country.input.ts
│   │   ├── filter-countries.input.ts
│   │   ├── create-state.input.ts
│   │   ├── update-state.input.ts
│   │   ├── filter-states.input.ts
│   │   └── index.ts
│   └── facades/
│       └── geography.facade.ts
└── tax/                          # Submódulo fiscal
    ├── tax.module.ts
    ├── tax.resolver.ts
    ├── tax-category.service.ts
    ├── tax-rate.service.ts
    ├── zone.service.ts
    ├── tax-calculation.service.ts
    ├── index.ts
    ├── entities/
    │   ├── tax-category.entity.ts
    │   ├── tax-rate.entity.ts
    │   ├── zone.entity.ts
    │   ├── zone-member.entity.ts
    │   ├── tax-calculation-result.entity.ts
    │   ├── order-tax-summary.entity.ts
    │   └── index.ts
    ├── dto/
    │   ├── create-tax-category.input.ts
    │   ├── update-tax-category.input.ts
    │   ├── create-tax-rate.input.ts
    │   ├── update-tax-rate.input.ts
    │   ├── create-zone.input.ts
    │   ├── update-zone.input.ts
    │   ├── create-zone-member.input.ts
    │   ├── filters.input.ts
    │   └── index.ts
    └── facades/
        └── tax.facade.ts
```

---

## Geography — Submódulo de Geografía

Gestiona países y estados/provincias. Utilizado por Address, Inventory, Store y otros módulos que necesitan validar referencias geográficas.

### Modelos Prisma

| Modelo    | Tabla              | Campos clave                                                   |
|-----------|--------------------|----------------------------------------------------------------|
| `Country` | `cdm_countries`    | `id`, `iso`, `iso3`, `iso_name`, `name`, `numcode`, `states_required`, `zipcode_required` |
| `GeoState`| `cdm_states`       | `id`, `name`, `abbr`, `country_id`                             |

### Servicios

- **CountryService** — CRUD completo de países, búsqueda por ISO/ISO3, validaciones de existencia.
- **GeoStateService** — CRUD de estados, filtrado por país, validación de pertenencia estado→país.

### Facade (GeographyFacade)

Punto de acceso público (11 métodos):

| Método                              | Descripción                                  |
|-------------------------------------|----------------------------------------------|
| `getCountryById(id)`                | Busca país por ID                            |
| `getCountryByIso(iso)`              | Busca país por código ISO de 2 letras        |
| `getCountryByIso3(iso3)`            | Busca país por código ISO de 3 letras        |
| `listCountries(filter?)`            | Lista países con filtro opcional              |
| `validateCountryExists(id)`         | Valida que el país existe (o lanza excepción) |
| `validateCountryExistsByIso(iso)`   | Valida existencia por ISO                     |
| `getStateById(id)`                  | Busca estado por ID                           |
| `listStatesByCountry(countryId)`    | Lista estados de un país                      |
| `listStates(filter?)`               | Lista estados con filtro opcional             |
| `validateStateExists(id)`           | Valida que el estado existe                   |
| `validateStateBelongsToCountry(stateId, countryId)` | Valida que el estado pertenece al país |

### Resolver (GeographyResolver)

Queries y mutations con prefijo `geo*`, todos decorados con `@SkipStoreContext()` y `@AllowAnonymous()` donde aplica.

| Operación                               | Tipo     | Nombre GraphQL                       |
|-----------------------------------------|----------|--------------------------------------|
| Listar países                           | Query    | `geoCountries`                       |
| Obtener país por ID                     | Query    | `geoCountry`                         |
| Obtener país por ISO                    | Query    | `geoCountryByIso`                    |
| Obtener país por ISO3                   | Query    | `geoCountryByIso3`                   |
| Crear país                              | Mutation | `createCountry`                      |
| Actualizar país                         | Mutation | `updateCountry`                      |
| Eliminar país                           | Mutation | `removeCountry`                      |
| Listar estados                          | Query    | `geoStates`                          |
| Obtener estado por ID                   | Query    | `geoState`                           |
| Estados por país                        | Query    | `geoStatesByCountry`                 |
| Validar estado pertenece a país         | Query    | `geoValidateStateBelongsToCountry`   |
| Crear estado                            | Mutation | `createGeoState`                     |
| Actualizar estado                       | Mutation | `updateGeoState`                     |
| Eliminar estado                         | Mutation | `removeGeoState`                     |

---

## Tax — Submódulo Fiscal

Gestiona categorías fiscales, tasas de impuesto, zonas fiscales y el motor de cálculo de impuestos. Utilizado por Sales, Fulfillment y Checkout para calcular impuestos en líneas de pedido, envíos y órdenes completas.

### Modelos Prisma

| Modelo         | Tabla                  | Campos clave                                                              |
|----------------|------------------------|---------------------------------------------------------------------------|
| `TaxCategory`  | `cdm_tax_categories`   | `id`, `name`, `description`, `is_default`, `tax_code`, `deleted_at`       |
| `TaxRate`      | `cdm_tax_rates`        | `id`, `amount` (Decimal 8,5), `zone_id`, `tax_category_id`, `included_in_price`, `show_rate_in_label`, `deleted_at` |
| `Zone`         | `cdm_zones`            | `id`, `name`, `description`, `default_tax`, `zone_members_count`, `kind`  |
| `ZoneMember`   | `cdm_zone_members`     | `id`, `zoneable_type`, `zoneable_id`, `zone_id` (polimórfico)             |

### Servicios

- **TaxCategoryService** — CRUD con soft-delete, `findDefault()`, `findByTaxCode()`, enforcement de un solo default activo.
- **TaxRateService** — CRUD con soft-delete, búsqueda por zona, por categoría, o por ambos. Incluye relaciones `zone` y `taxCategory` en cada consulta.
- **ZoneService** — CRUD de zonas y miembros (ZoneMember), conteo automático de miembros, `resolveZoneForState(stateId)` con fallback a zona default.
- **TaxCalculationService** — Motor de cálculo fiscal:
  - `calculateTax(amount, categoryId, zoneId)` — cálculo base.
  - `calculateLineTax(amount, categoryId, stateId?, zoneId?)` — para líneas de pedido, resuelve zona automáticamente.
  - `calculateShippingTax(amount, categoryId, stateId?, zoneId?)` — para envíos.
  - `calculateOrderTax(input)` — suma líneas + envío, retorna desglose completo.
  - Maneja **impuesto incluido en precio** (`included_in_price: true`) vs **impuesto adicional** (`included_in_price: false`).

### Facade (TaxFacade)

Punto de acceso público (16 métodos):

| Método                                        | Descripción                                      |
|-----------------------------------------------|--------------------------------------------------|
| `getCategoryById(id)`                         | Busca categoría fiscal por ID                    |
| `listCategories(filter?)`                     | Lista categorías con filtro                      |
| `getDefaultCategory()`                        | Obtiene la categoría fiscal por defecto          |
| `getCategoryByTaxCode(code)`                  | Busca categoría por código fiscal                |
| `validateCategoryExists(id)`                  | Valida existencia                                |
| `getRateById(id)`                             | Busca tasa por ID                                |
| `listRates(filter?)`                          | Lista tasas con filtro                           |
| `getRatesByZone(zoneId)`                      | Tasas de una zona                                |
| `getRatesByCategory(categoryId)`              | Tasas de una categoría                           |
| `getRatesByCategoryAndZone(catId, zoneId)`    | Tasas que coinciden en categoría y zona           |
| `getZoneById(id)`                             | Busca zona por ID                                |
| `resolveZoneForState(stateId)`                | Resuelve la zona fiscal para un estado           |
| `validateZoneExists(id)`                      | Valida existencia de zona                        |
| `calculateLineTax(amount, catId, stateId?, zoneId?)` | Calcula impuesto de una línea              |
| `calculateShippingTax(amount, catId, stateId?, zoneId?)` | Calcula impuesto de envío            |
| `calculateOrderTax(input)`                    | Calcula impuesto total de una orden              |

### Resolver (TaxResolver)

Queries y mutations con prefijo `tax*`, todos decorados con `@SkipStoreContext()`.

| Operación                    | Tipo     | Nombre GraphQL          |
|------------------------------|----------|-------------------------|
| Listar categorías            | Query    | `taxCategories`         |
| Obtener categoría            | Query    | `taxCategory`           |
| Categoría por defecto        | Query    | `taxCategoryDefault`    |
| Crear categoría              | Mutation | `createTaxCategory`     |
| Actualizar categoría         | Mutation | `updateTaxCategory`     |
| Eliminar categoría           | Mutation | `removeTaxCategory`     |
| Listar tasas                 | Query    | `taxRates`              |
| Obtener tasa                 | Query    | `taxRate`               |
| Tasas por zona               | Query    | `taxRatesByZone`        |
| Tasas por categoría          | Query    | `taxRatesByCategory`    |
| Crear tasa                   | Mutation | `createTaxRate`         |
| Actualizar tasa              | Mutation | `updateTaxRate`         |
| Eliminar tasa                | Mutation | `removeTaxRate`         |
| Listar zonas                 | Query    | `taxZones`              |
| Obtener zona                 | Query    | `taxZone`               |
| Miembros de zona             | Query    | `taxZoneMembers`        |
| Crear zona                   | Mutation | `createTaxZone`         |
| Actualizar zona              | Mutation | `updateTaxZone`         |
| Eliminar zona                | Mutation | `removeTaxZone`         |
| Agregar miembro a zona       | Mutation | `addTaxZoneMember`      |
| Eliminar miembro de zona     | Mutation | `removeTaxZoneMember`   |

### Lógica de cálculo fiscal

El motor distingue dos modos según el campo `included_in_price` de `TaxRate`:

**Impuesto adicional** (`included_in_price = false`):
```
additional_tax = amount × rate
taxable_amount = amount
```

**Impuesto incluido en precio** (`included_in_price = true`):
```
taxable_amount = amount / (1 + rate)
included_tax   = amount − taxable_amount
```

La resolución de zona sigue este flujo:
1. Si se proporciona `zone_id`, lo usa directamente.
2. Si se proporciona `state_id`, busca un `ZoneMember` con `zoneable_type = 'GeoState'` y `zoneable_id = stateId`.
3. Si no encuentra match, busca la zona con `default_tax = true` como fallback.

---

## Resultados de pruebas

**10 suites, 183 tests — todos exitosos.**

```
 PASS  src/location/geography/facades/geography.facade.spec.ts
 PASS  src/location/geography/state.service.spec.ts
 PASS  src/location/tax/zone.service.spec.ts
 PASS  src/location/geography/geography.resolver.spec.ts
 PASS  src/location/geography/country.service.spec.ts
 PASS  src/location/tax/tax-category.service.spec.ts
 PASS  src/location/tax/tax-rate.service.spec.ts
 PASS  src/location/tax/tax-calculation.service.spec.ts
 PASS  src/location/tax/facades/tax.facade.spec.ts
 PASS  src/location/tax/tax.resolver.spec.ts

Test Suites: 10 passed, 10 total
Tests:       183 passed, 183 total
Snapshots:   0 total
Time:        1.568 s
```

### Desglose por suite

| Suite                          | Tests |
|--------------------------------|-------|
| `country.service.spec.ts`      | 14    |
| `state.service.spec.ts`        | 14    |
| `geography.resolver.spec.ts`   | 14    |
| `geography.facade.spec.ts`     | 12    |
| `tax-category.service.spec.ts` | 17    |
| `tax-rate.service.spec.ts`     | 16    |
| `zone.service.spec.ts`         | 16    |
| `tax-calculation.service.spec.ts` | 14 |
| `tax.resolver.spec.ts`         | 24    |
| `tax.facade.spec.ts`           | 18    |
| **Total**                      | **183** ✅ |

---

## Integración global

El dominio Location se registra en `AppModule` vía `LocationModule`. No requiere `x-store-id` — todas las operaciones usan `@SkipStoreContext()` ya que la información geográfica y fiscal es global, no por tienda.

Los módulos de otros dominios (Sales, Fulfillment, Checkout) consumen las facades:
- `GeographyFacade` — para validar países y estados en direcciones.
- `TaxFacade` — para calcular impuestos en líneas, envíos y órdenes.
