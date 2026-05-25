# Dominio Catalog

## Overview

El **módulo Catalog** gestiona el catálogo de productos de la plataforma Correos de México. Es responsable de mantener el inventario de productos, sus variantes, precios, propiedades, taxonomías y activos digitales. Este dominio es fundamental para operaciones de comercio electrónico.

---

## Estructura del Módulo

El módulo Catalog se organiza en tres sub-módulos principales:

### 1. **Product Module** (`product/`)
Gestiona productos, variantes y precios.

**Servicios:**
- `ProductService` - CRUD de productos con búsqueda, filtros y paginación
- `VariantService` - Gestión de variantes de producto (SKU, dimensiones, etc.)
- `PriceService` - Gestión de precios por variante con soporte multimoneda
- `ProductResolver` - API GraphQL para consultas y mutaciones

**Entidades:**
- `Product` - Producto principal (nombre, slug, description, meta tags)
- `Variant` - Variante de producto (SKU, peso, dimensiones, costo)
- `Price` - Precio de variante (monto, moneda, precio de comparación)

**Características:**
- Validación de slugs únicos
- Soft-delete de productos, variantes y precios
- Filtrado por disponibilidad (fechas available_on / discontinue_on)
- Búsqueda por nombre, descripción y SKU
- Paginación configurable
- Soporte multimoneda en precios

---

### 2. **Catalog Module** (`catalog/`)
Gestiona taxonomías, prototipos, propiedades y taxones (categorización jerárquica de productos).

**Servicios:**
- `Taxonomy` - Categorías raíz de productos
- `Taxon` - Nodos individuales en la jerarquía (categoría, subcategoría, etc.)
- `Prototype` - Plantillas que definen propiedades y opciones para productos
- `Property` - Atributos de producto (color, tamaño, material, etc.)

**Entidades:**
- `Taxonomy` - Estructura de categorización (ej: "Productos Postales", "Servicios")
- `Taxon` - Nodo en taxonomía
- `Prototype` - Plantilla con propiedades y tipos de opciones
- `Property` - Atributo individual

**Características:**
- Jerarquía de categorías ilimitados
- Prototipos reutilizables
- Gestión de propiedades dinámicas
- URL-friendly slugs para categorías

---

### 3. **Asset Module** (`asset/`)
Gestiona activos digitales (imágenes, archivos) asociados a productos.

**Servicios:**
- `AssetService` - CRUD de activos con asociación a productos/variantes
- `SlugService` - Generación y gestión de slugs únicos
- `AssetResolver` - API GraphQL para activos

**Entidades:**
- `Asset` - Archivo digital (imagen, PDF, etc.)

**Características:**
- Generación automática de slugs
- Validación de unicidad de slugs
- Asociación flexible (producto, variante, etc.)
- Soporte de múltiples formatos

---

## Pruebas Implementadas

### Product Module Tests

#### `product.service.spec.ts` (ProductService)
**Pruebas Implementadas:**
- ✅ Definición del servicio
- ✅ Creación de producto con slug único
  - Debe crear producto exitosamente
  - Debe lanzar `AppConflictException` si slug ya existe
- ✅ Búsqueda por filtros
  - Por nombre y descripción (búsqueda completa)
  - Por slug específico
  - Por SKU de variante
  - Por disponibilidad (disponible, no disponible)
  - Paginación correcta
- ✅ Obtención de producto por ID
  - Debe retornar producto con todas sus relaciones
  - Debe lanzar `AppNotFoundException` si no existe
- ✅ Actualización de producto
  - Actualiza solo campos proporcionados
  - Valida slug único en actualizaciones
- ✅ Soft-delete y restore de producto
  - Marca deleted_at correctamente
  - Restore limpia deleted_at

**Cobertura:**
- Mocking de PrismaService
- Pruebas de validación de negocio
- Pruebas de casos edge (fechas, valores nulos)

---

#### `variant.service.spec.ts` (VariantService)
**Pruebas Implementadas:**
- ✅ Definición del servicio
- ✅ Creación de variante
  - Valida que producto exista
  - Valida SKU único dentro del producto
  - Crea como master o variante secundaria
- ✅ Búsqueda de variantes
  - Por ID
  - Por ID de producto
  - Por SKU específico
- ✅ Actualización de variante
  - Modifica propiedades (precio de costo, weight, etc.)
  - Valida cambios de SKU
- ✅ Soft-delete de variante
  - Marca con deleted_at
  - Mantiene historial

**Cobertura:**
- Validación de dependencias (producto debe existir)
- Validación de unicidad de SKU
- Manejo de variantes master vs secundarias

---

#### `price.service.spec.ts` (PriceService)
**Pruebas Implementadas:**
- ✅ Definición del servicio
- ✅ Creación de precio
  - Valida que variante exista
  - Crea con monto, moneda y precio de comparación
- ✅ Búsqueda de precios
  - Por ID
  - Todos los precios de una variante
  - Precio base (más antiguo)
- ✅ Actualización de precio
  - Modifica monto y comparación
- ✅ Eliminación de precio (soft-delete)
  - Marca con deleted_at

**Cobertura:**
- Validación de relación variante-precio
- Manejo de múltiples precios por variante
- Soporte multimoneda

---

#### `product.resolver.spec.ts` (ProductResolver)
**Pruebas Implementadas:**
- ✅ Queries GraphQL
  - `product(id)` - obtiene producto
  - `products(filter)` - lista con filtros
  - `productBySlug(slug)` - búsqueda por slug
- ✅ Mutations GraphQL
  - `createProduct(input)` - crea producto
  - `updateProduct(input)` - actualiza
  - `deleteProduct(id)` - soft-delete

**Cobertura:**
- Resolución de campos de producto
- Paginación en respuestas
- Manejo de errores

---

### Catalog Module Tests

#### `taxonomy.service.spec.ts` (TaxonomyService)
**Pruebas Implementadas:**
- ✅ CRUD de taxonomías
- ✅ Búsqueda de taxonomías raíz
- ✅ Soft-delete con validación de dependencias

---

#### `taxon.service.spec.ts` (TaxonService)
**Pruebas Implementadas:**
- ✅ Creación de taxón
  - Valida taxonomía padre existe
  - Valida slug único dentro de taxonomía
- ✅ Búsqueda jerárquica
  - Todos los taxones de una taxonomía
  - Ruta completa de categoría
- ✅ Actualización con validación de slug

---

#### `prototype.service.spec.ts` (PrototypeService)
**Pruebas Implementadas:**
- ✅ CRUD de prototipos
- ✅ Asociación con propiedades
- ✅ Asociación con tipos de opciones

---

#### `property.service.spec.ts` (PropertyService)
**Pruebas Implementadas:**
- ✅ CRUD de propiedades
- ✅ Validación de propiedades único por nombre

---

#### `catalog.resolver.spec.ts` (CatalogResolver)
**Pruebas Implementadas:**
- ✅ Queries GraphQL de taxonomías
- ✅ Mutations de categorías

---

### Asset Module Tests

#### `asset.service.spec.ts` (AssetService)
**Pruebas Implementadas:**
- ✅ CRUD de activos
- ✅ Asociación a productos/variantes
- ✅ Validación de tipo de archivo
- ✅ Soft-delete de activos

---

#### `slug.service.spec.ts` (SlugService)
**Pruebas Implementadas:**
- ✅ Generación de slugs desde texto
- ✅ Validación de unicidad
- ✅ Incremento automático si existe (slug-1, slug-2, etc.)

---

#### `asset.resolver.spec.ts`
**Pruebas Implementadas:**
- ✅ Queries y mutations de activos en GraphQL

---

## Validación de Correctitud

### 1. **Estrategia de Testing**

#### Unit Tests (Servicios)
- Cada servicio tiene pruebas aisladas con Prisma mockeado
- Se valida lógica de negocio (validaciones, transformaciones)
- Se prueban casos happy path y error cases
- Se usan fixtures consistentes para datos de prueba

#### Integration Tests (Resolvers)
- Se prueban resolvers GraphQL completos
- Se valida que queries y mutations esperen inputs correctos
- Se verifica que respuestas tienen estructura esperada

### 2. **Cobertura de Casos**

**Happy Path:**
- ✅ Creación exitosa de entidades
- ✅ Búsqueda y actualización exitosa
- ✅ Eliminación (soft-delete) exitosa
- ✅ Paginación correcta

**Error Cases:**
- ✅ Relaciones quebradas (producto no existe → no crear variante)
- ✅ Violación de unicidad (slug o SKU duplicados)
- ✅ Entidad no encontrada
- ✅ Campos requeridos faltantes

**Edge Cases:**
- ✅ Disponibilidad basada en fechas (available_on, discontinue_on)
- ✅ Soft-delete y filtrado automático
- ✅ Queries complejas con múltiples filtros
- ✅ Paginación con límites extremos

### 3. **Validaciones de Negocio**

| Validación | Ubicación | Prueba |
|------------|-----------|--------|
| Slug único | ProductService | ✅ create, update |
| SKU único por producto | VariantService | ✅ create, update |
| Producto debe existir | VariantService | ✅ create |
| Variante debe existir | PriceService | ✅ create |
| Taxonomy debe existir | TaxonService | ✅ create |
| Taxon slug único | TaxonService | ✅ create, update |
| Property nombre único | PropertyService | ✅ create |
| Asset slug único | AssetService | ✅ create |

### 4. **Consistencia de Datos**

- ✅ Soft-delete (`deleted_at`) se aplica automáticamente
- ✅ Queries excluyen automáticamente registros eliminados
- ✅ Relaciones se cargan correctamente (includes)
- ✅ Timestamps (createdAt, updatedAt) se asignan automáticamente

### 5. **Validación de Tipos**

- ✅ Todos los servicios tipados correctamente con TypeScript
- ✅ DTOs validados con class-validator
- ✅ Entidades GraphQL con tipos correctos
- ✅ Resolvers retornan tipos esperados

---

## Estadísticas de Testing

| Métrica | Valor |
|---------|-------|
| **Archivos Spec** | 11 |
| **Test Suites** | 11 |
| **Total Tests** | ~150+ |
| **Test Status** | ✅ All Passing |
| **Cobertura** | ServicesCompleta, Resolvers Completa |

---

## Comandos de Testing

```bash
# Ejecutar todas las pruebas del catalog
pnpm test -- src/catalog

# Ejecutar pruebas de un servicio específico
pnpm test -- src/catalog/product/product.service.spec

# Cobertura de tests
pnpm test:cov -- src/catalog

# Watch mode (desarrollo)
pnpm test:watch -- src/catalog
```

---

## Arquitectura de Datos

### Relaciones Principales

```
Taxonomy (raíz)
  ├── Taxon (categoría)
  │   └── Taxon (subcategoría)

Product
  ├── Variant (variante de producto)
  │   ├── Price (precio en moneda)
  │   └── PropertyValue (valores propiedades)
  ├── Asset (imagen/archivo)
  └── Prototype (plantilla)
      ├── Property (atributos)
      └── OptionType (opciones)
```

### Soft-Delete Strategy

Todas las entidades principales soportan soft-delete:
- `deleted_at` solo se establece, nunca se ejecuta DELETE
- Queries automáticamente excluyen `deleted_at IS NOT NULL`
- Permite auditoría completa y recuperación de datos

---

## Próximos Pasos / Mejoras Futuras

- [ ] Implementar caché para taxonomías (raramente cambian)
- [ ] Agregar búsqueda fulltext para productos
- [ ] Sincronización con sistema de inventario
- [ ] Generar sitemap automático desde slugs
- [ ] Validación de árbolde categorías (ciclos)
- [ ] Reportes de productos más vendidos
- [ ] Sincronización con plataformas externas

---

**Última Actualización:** 27 de marzo de 2026  
**Versión:** 1.0  
**Estado:** ✅ Completamente Funcional y Testeado
