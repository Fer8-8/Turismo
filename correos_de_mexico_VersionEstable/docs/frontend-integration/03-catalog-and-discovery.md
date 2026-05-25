# catalogo y descubrimiento de productos

## estructura del catalogo

el catalogo se compone de tres sub-modulos:

- **product**: productos, variantes, precios
- **catalog**: taxonomias (arboles de categorias), propiedades de producto, prototipos
- **asset**: imagenes, archivos adjuntos, slugs amigables

---

## productos

### consultar lista de productos

```graphql
query {
  products(filterProductsInput: {
    page: 1
    limit: 20
    search: "camiseta"
  }) {
    data {
      id
      name
      description
      slug
      available_on
      discontinue_on
      promotionable
      meta_title
      meta_description
      variants {
        id
        sku
        is_master
        weight
        track_inventory
        prices {
          id
          amount
          currency
          compare_at_amount
        }
      }
      created_at
    }
    total
    page
    limit
    pages
  }
}
```

esta query es `@AllowAnonymous()` — no requiere autenticacion.

#### filtros disponibles

| campo | tipo | descripcion |
|-------|------|-------------|
| `page` | Int | pagina actual (min 1, default 1) |
| `limit` | Int | items por pagina (min 1, max 100, default 10) |
| `search` | String | busca en nombre y descripcion (case-insensitive, contains) |
| `slug` | String | busqueda exacta por slug |
| `sku` | String | busca variantes con ese SKU (case-insensitive) |
| `available` | Boolean | filtra por disponibilidad comercial (considera `available_on` y `discontinue_on`) |

#### respuesta paginada

```typescript
ProductConnection {
  data: Product[]    // lista de productos
  total: Int         // total de productos que matchean
  page: Int          // pagina actual
  limit: Int         // items por pagina
  pages: Int         // total de paginas
}
```

### consultar producto por ID

```graphql
query {
  product(id: "uuid-del-producto") {
    id
    name
    description
    slug
    variants {
      id
      sku
      is_master
      prices {
        amount
        currency
        compare_at_amount
      }
    }
  }
}
```

`@AllowAnonymous()` — no requiere auth.

### consultar producto por slug

```graphql
query {
  productBySlug(slug: "camiseta-roja-xl") {
    id
    name
    description
    slug
    variants {
      id
      sku
      is_master
      prices {
        amount
        currency
        compare_at_amount
      }
    }
  }
}
```

`@AllowAnonymous()` — ideal para URLs amigables tipo `/producto/camiseta-roja-xl`.

si el slug no existe, el backend lanza `NotFoundException`.

### productos por tienda

```graphql
query {
  productsByStore(storeId: "uuid-de-tienda") {
    id
    name
    slug
  }
}
```

`@AllowAnonymous()` — devuelve solo productos asignados a la tienda indicada.

### verificar disponibilidad de producto

```graphql
query {
  isProductAvailable(id: "uuid-del-producto")
}
```

devuelve `Boolean`. verifica que `available_on <= now` y `discontinue_on` no haya pasado (o sea null).

---

## variantes

cada producto tiene una o mas variantes. la variante `is_master: true` es la variante principal (en algunos modelos, equivale al producto "base").

### consultar variantes de un producto

```graphql
query {
  variantsByProduct(productId: "uuid") {
    id
    sku
    is_master
    weight
    height
    width
    depth
    track_inventory
    position
    discontinue_on
    prices {
      id
      amount
      currency
      compare_at_amount
    }
  }
}
```

`@AllowAnonymous()` — devuelve variantes activas (no eliminadas) ordenadas por `position`.

### buscar variante por SKU

```graphql
query {
  variantBySku(sku: "SKU-12345") {
    id
    sku
    is_master
    prices {
      amount
      currency
    }
  }
}
```

`@AllowAnonymous()` — el SKU es unico en todo el sistema, a traves de todos los productos.

### verificar disponibilidad de variante

```graphql
query {
  isVariantAvailable(id: "uuid-variante")
}
```

devuelve `Boolean`. verifica que la variante no este descontinuada y que el producto padre este disponible.

---

## precios

los precios estan asociados a variantes, no directamente a productos. un producto puede tener multiples variantes, y cada variante puede tener multiples precios (soporte multimoneda).

### consultar precios de una variante

```graphql
query {
  pricesByVariant(variantId: "uuid") {
    id
    amount
    currency
    compare_at_amount
    created_at
  }
}
```

`@AllowAnonymous()`.

- `amount`: precio actual (tipo `String` para precision decimal)
- `compare_at_amount`: precio de comparacion/tachado ("antes: $X"). puede ser null
- `currency`: codigo de moneda (e.g. "MXN", "USD")

el "precio base" de una variante es el precio mas antiguo activo (primer `created_at`). el backend lo resuelve internamente para calculos de totales en ordenes.

---

## taxonomias y categorias

las taxonomias son la estructura de navegacion del catalogo: arboles jerarquicos de categorias.

### estructura

```
Taxonomy (raiz)
  └── Taxon (nodo de categoria)
      ├── Taxon hijo
      │   └── Taxon nieto
      └── Taxon hijo
```

una `Taxonomy` es un arbol completo (ej: "departamentos", "genero", "temporada").  
un `Taxon` es un nodo dentro del arbol (ej: "ropa", "hombre", "otono-2026").

### listar taxonomias

```graphql
query {
  taxonomies {
    id
    name
    position
    store_id
    taxons {
      id
      name
      permalink
      position
      depth
      hide_from_nav
      children {
        id
        name
        permalink
        depth
      }
    }
  }
}
```

`@AllowAnonymous()` — devuelve todas las taxonomias con hasta 3 niveles de profundidad.

### taxonomias por tienda

```graphql
query {
  taxonomiesByStore(storeId: "uuid") {
    id
    name
    taxons {
      id
      name
      permalink
    }
  }
}
```

`@AllowAnonymous()` — filtra taxonomias por `store_id`.

### obtener arbol completo de una taxonomia

```graphql
query {
  taxonTree(taxonomyId: "uuid") {
    id
    name
    permalink
    depth
    position
    hide_from_nav
    children {
      id
      name
      permalink
      depth
      children {
        id
        name
        permalink
        depth
      }
    }
  }
}
```

`@AllowAnonymous()` — devuelve el arbol completo hasta 3 niveles.

### taxones visibles (para navegacion)

```graphql
query {
  visibleTaxons(taxonomyId: "uuid") {
    id
    name
    permalink
    depth
    position
  }
}
```

`@AllowAnonymous()` — excluye taxones con `hide_from_nav: true`.

### obtener ancestros de un taxon (breadcrumb)

```graphql
query {
  taxonAncestors(id: "uuid-del-taxon") {
    id
    name
    permalink
    depth
  }
}
```

`@AllowAnonymous()` — devuelve la cadena desde la raiz hasta el taxon. util para construir breadcrumbs.

### taxones de un producto

```graphql
query {
  taxonsByProduct(productId: "uuid") {
    id
    name
    permalink
  }
}
```

`@AllowAnonymous()` — devuelve las categorias a las que pertenece un producto.

---

## propiedades de producto

las propiedades son atributos dinamicos como color, material, talla. se definen globalmente y se asignan a productos con valores especificos.

### propiedades filtrables (para sidebar de filtros)

```graphql
query {
  filterableProperties {
    id
    name
    presentation
    filterable
    filter_param
  }
}
```

`@AllowAnonymous()` — devuelve propiedades marcadas como `filterable: true`. el campo `filter_param` indica el parametro de URL sugerido para esa propiedad.

### propiedades de un producto (para PDP)

```graphql
query {
  propertiesByProduct(productId: "uuid") {
    id
    value
    position
    show_property
    property_id
  }
}
```

`@AllowAnonymous()` — devuelve los valores de propiedades asignados al producto.

### solo propiedades visibles

```graphql
query {
  visiblePropertiesByProduct(productId: "uuid") {
    id
    value
    position
  }
}
```

`@AllowAnonymous()` — filtra por `show_property: true`.

---

## assets (imagenes y archivos)

los assets son polimorfico — se asocian a cualquier entidad via `viewable_type` y `viewable_id`.

### imagenes de un producto

```graphql
query {
  assetsByEntity(viewableType: "Product", viewableId: "uuid-producto") {
    id
    attachment_file_name
    attachment_content_type
    attachment_file_size
    attachment_width
    attachment_height
    alt
    position
    type
  }
}
```

`@AllowAnonymous()` — devuelve assets ordenados por `position`.

### imagen principal de un producto

```graphql
query {
  primaryAsset(viewableType: "Product", viewableId: "uuid-producto") {
    id
    attachment_file_name
    alt
  }
}
```

`@AllowAnonymous()` — devuelve el asset con position mas baja (tipicamente 0).

### verificar si una entidad tiene assets

```graphql
query {
  entityHasAssets(viewableType: "Product", viewableId: "uuid-producto")
}
```

`@AllowAnonymous()` — devuelve `Boolean`.

nota: el backend almacena metadata del asset (nombre, tipo, dimensiones), pero no queda confirmado desde el codigo revisado como se construye la URL publica del archivo. el frontend no debe derivar esa URL solo a partir de `attachment_file_name` sin contrato adicional.

---

## slugs amigables

el backend usa `FriendlySlug` como entidad independiente para resolver URLs amigables.

### resolver entidad por slug

```graphql
query {
  slugByValue(slug: "camiseta-roja", scope: "Product") {
    id
    slug
    sluggable_type
    sluggable_id
    is_primary
  }
}
```

`@AllowAnonymous()` — devuelve la referencia a la entidad (tipo + ID). el frontend puede usar `sluggable_id` para hacer la query del producto.

flujo posible: URL → `slugByValue` → obtener `sluggable_id` → `product(id)`.

para PDP de producto, `productBySlug(slug)` es el contrato mas directo y menos interpretativo.

### verificar disponibilidad de slug

```graphql
query {
  slugExists(slug: "camiseta-roja", scope: "Product")
}
```

`@AllowAnonymous()` — devuelve `Boolean`. util sobre todo para formularios administrativos o de backoffice.

---

## consulta de disponibilidad de inventario (desde catalogo)

el frontend puede consultar la disponibilidad de una variante sin necesidad de crear una orden:

```graphql
query {
  isVariantAvailable(variantId: "uuid", quantity: 1)
}
```

o con mas detalle:

```graphql
query {
  variantAvailability(variantId: "uuid") {
    variantId
    totalOnHand
    totalReserved
    totalAvailable
    locations {
      stockItemId
      onHand
      reserved
      available
      backorderable
    }
  }
}
```

estos datos permiten construir estados de stock en listing y PDP. el criterio visual exacto para "pocas unidades" o etiquetas similares queda del lado del frontend.

---

## datos utiles por vista de frontend

### listing (PLP)

- `products(filterProductsInput)` o `productsByStore(storeId)` para la lista
- `taxonomies` o `taxonTree` para la navegacion lateral
- `filterableProperties` para los filtros de sidebar
- `primaryAsset(viewableType: "Product", viewableId)` para la imagen de thumbnail
- `isVariantAvailable` o `variantAvailability` para el badge de stock

### pagina de detalle (PDP)

- `product(id)` o `productBySlug(slug)` para los datos del producto
- `variantsByProduct(productId)` si los variantes no vienen incluidos
- `pricesByVariant(variantId)` para precios multimoneda
- `propertiesByProduct(productId)` para atributos (color, talla, etc.)
- `assetsByEntity(viewableType: "Product", viewableId)` para la galeria
- `taxonsByProduct(productId)` para breadcrumbs
- `variantAvailability(variantId)` para estado de stock

### navegacion por categorias

- `taxonomiesByStore(storeId)` cuando la navegacion dependa explicitamente de tienda
- `visibleTaxons(taxonomyId)` para exclusion de categorias ocultas
- `taxonChildren(parentId)` si la UI necesita carga lazy de subcategorias
- `taxonAncestors(id)` para breadcrumbs

### busqueda

- `products(filterProductsInput: { search: "termino" })` — busqueda basica por nombre y descripcion
- no existe un motor de busqueda dedicado (algolia, elasticsearch). la busqueda es por `LIKE` en la BD

---

## limitaciones y observaciones

- **no hay busqueda full-text avanzada**: la busqueda por `search` usa `contains` (case-insensitive) sobre nombre y descripcion. no hay relevancia, fuzzy matching, ni sugerencias.
- **no hay filtrado por precio** en la query de productos. si el frontend necesita filtrar por rango de precio, debera hacerlo del lado del cliente o solicitar esta feature al backend.
- **no hay filtrado por propiedad** (color, talla) en la query de productos. las propiedades existen como datos pero no como filtros en `FilterProductsInput`.
- **slugs y productos**: los productos tienen un campo `slug` directo en el modelo, pero tambien existe `FriendlySlug` como entidad separada. `productBySlug` usa el campo `slug` del producto. `FriendlySlug` puede servir para resolucion adicional de slugs, pero no debe asumirse como sistema completo de aliases o redirects sin contrato adicional.
- **los precios son strings**: en el dominio de catalogo, `amount` y `compare_at_amount` son `String` (para precision). el frontend debe hacer `parseFloat()` para mostrarlos como numeros. en el dominio de ventas, los totales son `Float`.
- **soft-delete transparente**: los productos, variantes, precios y assets eliminados no aparecen en las queries normales. el frontend no necesita filtrar.
