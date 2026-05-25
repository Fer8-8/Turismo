# cambios y desarrollo - 04/03/26


## desarrollo: módulo product

### descripción general

se implementó el módulo product de forma completa, siguiendo el patrón service→resolver→entity de NestJS con soporte GraphQL. el módulo incluye gestión completa de productos con variantes, precios, paginación y soft delete.

### estructura de directorios creada

```
src/product/
├── entities/
│   ├── product.entity.ts
│   ├── variant.entity.ts
│   ├── price.entity.ts
│   └── product-connection.entity.ts
├── dto/
│   ├── create-product.input.ts
│   ├── update-product.input.ts
│   └── filter-products.input.ts
├── product.service.ts
├── product.resolver.ts
└── product.module.ts
```

### entities (tipos GraphQL)

#### product.entity.ts

representa un producto en el sistema. contiene información general, metadatos para SEO, variantes y precios asociados.

campos principales:
- `id` (string UUID)
- `name` (string, 3-255 caracteres)
- `description` (string opcional)
- `slug` (string, identificador único para URLs)
- `meta_title` (string para SEO)
- `meta_description` (string para SEO)
- `meta_keywords` (string para SEO)
- `promotionable` (boolean, si se puede promocionar)
- `available_on` (Date, fecha de disponibilidad)
- `discontinue_on` (Date opcional, fecha de descontinuación)
- `variants` (array de Variant)
- `created_at` (timestamp de creación)
- `updated_at` (timestamp de última actualización)

#### variant.entity.ts

representa una variante de producto (SKU, color, tamaño, etc.).

campos principales:
- `id` (string UUID)
- `sku` (string, identificador de stock)
- `weight` (decimal, peso)
- `height` (decimal, alto)
- `width` (decimal, ancho)
- `depth` (decimal, profundidad)
- `is_master` (boolean, si es la variante maestra)
- `cost_price` (string decimal, costo)
- `cost_currency` (string, moneda del costo)
- `track_inventory` (boolean, si se rastrea inventario)
- `prices` (array de Price)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### price.entity.ts

representa un precio para una variante de producto.

campos principales:
- `id` (string UUID)
- `amount` (string decimal, cantidad del precio)
- `currency` (string, moneda ISO 4217)
- `compare_at_amount` (string decimal opcional, precio original para comparativa)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### product-connection.entity.ts

wrapper para respuestas paginadas. permite retornar múltiples productos con información de paginación.

campos principales:
- `data` (array de Product)
- `total` (número total de registros)
- `page` (número de página actual)
- `limit` (cantidad de registros por página)
- `pages` (número total de páginas)

### DTOs (validación de inputs)

#### create-product.input.ts

valida los datos para crear un nuevo producto.

campos:
- `name` (requerido, string 3-255 caracteres)
- `description` (opcional, string)
- `slug` (opcional, string)
- `meta_title` (opcional, string)
- `meta_description` (opcional, string)
- `meta_keywords` (opcional, string)
- `promotionable` (opcional, booleano, default: false)

ejemplo de validación:
```typescript
name debe ser string de 3 a 255 caracteres
otros campos deben ser string si se proporcionan
```

#### update-product.input.ts

valida los datos para actualizar un producto existente. todos los campos son opcionales excepto el `id`.

campos:
- `id` (requerido, string UUID)
- todos los campos de create-product.input (opcionales)

#### filter-products.input.ts

valida parámetros de búsqueda, filtrado y paginación.

campos:
- `page` (número, default: 1, mínimo: 1)
- `limit` (número, default: 10, mínimo: 1, máximo: 100)
- `search` (opcional, string para buscar en nombre y descripción)
- `slug` (opcional, string para filtrar por slug)

### service (product.service.ts)

implementa la lógica de negocio con 6 métodos principales:

#### create(createProductInput)
crea nuevo producto con validación de entrada completa. retorna el producto creado con variantes asociadas.

parámetros:
- `createProductInput`: objeto con nombre, descripción, slug, metadatos, etc.

retorna:
- objeto Product completo

excepciones:
- BadRequestException si hay error en validación

#### findAll(filterProductsInput)
obtiene todos los productos con paginación y filtros opcionales. soporta búsqueda por nombre/descripción.

parámetros:
- `filterProductsInput`: objeto con page, limit, search, slug

retorna:
- ProductConnection con array de productos + metadatos de paginación

características:
- búsqueda por nombre o descripción (case-insensitive)
- filtrado por slug exacto
- soft delete: excluye productos con deleted_at no nulo
- paginación con skip/take

#### findOne(id)
obtiene producto específico por identificador único. incluye variantes y precios.

parámetros:
- `id`: string UUID del producto

retorna:
- objeto Product completo o null

excepciones:
- NotFoundException si el producto no existe

#### findBySlug(slug)
obtiene producto por slug (alternativa para navegación web).

parámetros:
- `slug`: string identificador único

retorna:
- objeto Product o null

características:
- slug debe ser único en base de datos
- excluye productos eliminados (soft delete)

#### update(id, updateProductInput)
actualiza producto existente con datos parciales permitidos. solo actualiza campos proporcionados.

parámetros:
- `id`: string UUID
- `updateProductInput`: objeto con campos a actualizar

retorna:
- objeto Product actualizado

características:
- validación de existencia antes de actualizar
- actualización parcial: solo campos no undefined
- mantiene valores existentes de campos no proporcionados

#### remove(id)
elimina producto usando soft delete. establece timestamp deleted_at para mantener historial.

parámetros:
- `id`: string UUID

retorna:
- booleano true si se eliminó correctamente

características:
- soft delete: no borra datos, los marca como eliminados
- mantiene integridad de datos históricos
- findAll excluye automáticamente productos eliminados

### resolver (product.resolver.ts)

expone 6 endpoints GraphQL que consumen el service. implementa autenticación mediante decorador @AllowAnonymous() para queries públicas.

#### query: products

lista todos los productos con paginación.

```graphql
query {
  products(page: 1, limit: 10, search: "nombre", slug: "slug-producto") {
    data {
      id
      name
      description
      slug
      variants {
        id
        sku
      }
    }
    total
    page
    limit
    pages
  }
}
```

parámetros:
- `page`: número de página (default: 1)
- `limit`: registros por página (default: 10)
- `search`: texto a buscar en nombre/descripción (opcional)
- `slug`: filtrar por slug exacto (opcional)

retorna: ProductConnection

acceso: público (@AllowAnonymous)

#### query: product

obtiene producto específico por identificador.

```graphql
query {
  product(id: "uuid-aqui") {
    id
    name
    description
    slug
    variants {
      id
      sku
      prices {
        amount
        currency
      }
    }
    created_at
    updated_at
  }
}
```

parámetros:
- `id`: string UUID del producto

retorna: Product

acceso: público (@AllowAnonymous)

#### query: productBySlug

obtiene producto por slug, útil para páginas de producto en frontend.

```graphql
query {
  productBySlug(slug: "nombre-producto") {
    id
    name
    description
    variants {
      id
      sku
    }
  }
}
```

parámetros:
- `slug`: string slug del producto

retorna: Product

acceso: público (@AllowAnonymous)

#### mutation: createProduct

crea nuevo producto. requiere autenticación token de usuario.

```graphql
mutation {
  createProduct(createProductInput: {
    name: "nombre del producto"
    description: "descripción del producto"
    slug: "nombre-del-producto"
    meta_title: "título para SEO"
    meta_description: "descripción para SEO"
    promotionable: true
  }) {
    id
    name
    slug
  }
}
```

parámetros:
- `createProductInput`: objeto CreateProductInput

retorna: Product creado

acceso: requiere autenticación (token en Authorization header)

excepciones:
- Unauthorized si no hay token válido
- BadRequestException si datos inválidos

#### mutation: updateProduct

actualiza producto existente. requiere autenticación.

```graphql
mutation {
  updateProduct(id: "uuid-aqui", updateProductInput: {
    name: "nuevo nombre"
    description: "nueva descripción"
  }) {
    id
    name
    updated_at
  }
}
```

parámetros:
- `id`: string UUID del producto
- `updateProductInput`: objeto UpdateProductInput (todos campos opcionales)

retorna: Product actualizado

acceso: requiere autenticación

#### mutation: removeProduct

elimina producto (soft delete). requiere autenticación.

```graphql
mutation {
  removeProduct(id: "uuid-aqui")
}
```

parámetros:
- `id`: string UUID del producto

retorna: booleano (true si se eliminó)

acceso: requiere autenticación

### module (product.module.ts)

módulo NestJS que encapsula toda la funcionalidad de productos.

estructura:
- imports: [PrismaModule] - importa servicio de base de datos
- providers: [ProductService, ProductResolver] - registra service y resolver
- exports: [ProductService] - expone service para otros módulos

integración:
- registrado en app.module.ts en el array imports
- inicializa con toda la aplicación

---

## cambios: autenticación REST

### descripción general

se implementó una capa completa de autenticación REST que complementa betterAuth. betterAuth maneja automáticamente rutas en `/api/auth/*` (email, password, tokens), mientras que este layer agrega helpers adicionales.

### endpoints REST de autenticación

#### POST /auth/check-email

valida si un email existe en el sistema antes de signup.

request:
```bash
curl -X POST http://localhost:3000/auth/check-email \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@ejemplo.com"}'
```

response (exitoso):
```json
{
  "email": "usuario@ejemplo.com",
  "exists": false
}
```

response (error):
```json
{
  "error": "Email es requerido",
  "statusCode": 400
}
```

#### GET /auth/session

obtiene información de sesión actual del usuario autenticado.

request:
```bash
curl -X GET http://localhost:3000/auth/session \
  -H "Authorization: Bearer <token-aqui>"
```

response (exitoso):
```json
{
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com",
    "name": "nombre del usuario",
    "created_at": "2026-03-04T10:00:00Z"
  },
  "expiresAt": "2026-03-05T10:00:00Z"
}
```

response (error):
```json
{
  "error": "Se requiere token en header Authorization",
  "statusCode": 401
}
```

#### GET /auth/validate

valida si la sesión es válida sin retornar datos del usuario.

request:
```bash
curl -X GET http://localhost:3000/auth/validate \
  -H "Authorization: Bearer <token-aqui>"
```

response (válido):
```json
{
  "valid": true
}
```

response (inválido):
```json
{
  "valid": false
}
```

nota: si no se envía authorization header, retorna `{"valid": false}` sin errores.

#### POST /auth/sign-out

cierra la sesión del usuario actual.

request:
```bash
curl -X POST http://localhost:3000/auth/sign-out \
  -H "Authorization: Bearer <token-aqui>"
```

response (exitoso):
```json
{
  "success": true,
  "message": "sesión cerrada correctamente"
}
```

response (error):
```json
{
  "error": "Se requiere token en header Authorization",
  "statusCode": 401
}
```

#### POST /auth/refresh

refresca el token de sesión actual.

request:
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Authorization: Bearer <token-aqui>"
```

response (exitoso):
```json
{
  "token": "nuevo-token-aqui",
  "expiresAt": "2026-03-05T10:00:00Z"
}
```

response (error):
```json
{
  "error": "Token inválido o expirado",
  "statusCode": 401
}
```

#### POST /auth/change-password

cambia la contraseña del usuario autenticado.

request:
```bash
curl -X POST http://localhost:3000/auth/change-password \
  -H "Authorization: Bearer <token-aqui>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "contraseña-actual",
    "newPassword": "nueva-contraseña"
  }'
```

response (exitoso):
```json
{
  "success": true,
  "message": "contraseña actualizada correctamente"
}
```

response (error):
```json
{
  "error": "contraseña actual incorrecta",
  "statusCode": 400
}
```

#### POST /api/auth/sign-up/email (betterAuth)

crea nueva cuenta de usuario. esta ruta es generada automáticamente por betterAuth.

request:
```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "contraseña-segura",
    "name": "nombre del usuario"
  }'
```

response (exitoso):
```json
{
  "user": {
    "id": "uuid-generado",
    "email": "usuario@ejemplo.com",
    "name": "nombre del usuario"
  },
  "token": "token-jwt-aqui"
}
```

response (error):
```json
{
  "error": "email ya registrado",
  "statusCode": 400
}
```

#### POST /api/auth/sign-in/email (betterAuth)

inicia sesión con email y contraseña. ruta generada automáticamente por betterAuth.

request:
```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "contraseña-correcta"
  }'
```

response (exitoso):
```json
{
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com",
    "name": "nombre del usuario"
  },
  "token": "token-jwt-aqui",
  "expiresAt": "2026-03-05T10:00:00Z"
}
```

response (error):
```json
{
  "error": "credenciales inválidas",
  "statusCode": 401
}
```

### patrones de autenticación para frontend

#### 1. registro de usuario

```javascript
// 1. verificar si email existe (opcional pero recomendado)
const checkResponse = await fetch('http://localhost:3000/auth/check-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'usuario@ejemplo.com' })
});

// 2. si email disponible, hacer signup
const signupResponse = await fetch('http://localhost:3000/api/auth/sign-up/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@ejemplo.com',
    password: 'contraseña-segura',
    name: 'nombre completo'
  })
});

const { token, user } = await signupResponse.json();

// 3. guardar token en localStorage/sessionStorage
localStorage.setItem('authToken', token);
localStorage.setItem('user', JSON.stringify(user));
```

#### 2. inicio de sesión

```javascript
const loginResponse = await fetch('http://localhost:3000/api/auth/sign-in/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@ejemplo.com',
    password: 'contraseña-correcta'
  })
});

const { token, user } = await loginResponse.json();

// guardar token
localStorage.setItem('authToken', token);
localStorage.setItem('user', JSON.stringify(user));

// redirigir a dashboard
window.location.href = '/dashboard';
```

#### 3. verificar sesión al cargar app

```javascript
async function checkAuth() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // no hay sesión, redirigir a login
    window.location.href = '/login';
    return false;
  }

  // validar si token sigue siendo válido
  const response = await fetch('http://localhost:3000/auth/validate', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const { valid } = await response.json();

  if (!valid) {
    // token expirado, intentar refrescar
    return await refreshToken();
  }

  return true;
}
```

#### 4. refrescar token

```javascript
async function refreshToken() {
  const token = localStorage.getItem('authToken');

  const response = await fetch('http://localhost:3000/auth/refresh', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    // no se pudo refrescar, usuario debe hacer login nuevamente
    localStorage.clear();
    window.location.href = '/login';
    return false;
  }

  const { token: newToken } = await response.json();
  localStorage.setItem('authToken', newToken);
  return true;
}
```

#### 5. cerrar sesión

```javascript
async function logout() {
  const token = localStorage.getItem('authToken');

  await fetch('http://localhost:3000/auth/sign-out', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  // limpiar storage
  localStorage.clear();

  // redirigir a login
  window.location.href = '/login';
}
```

#### 6. hacer request autenticado

```javascript
async function makeAuthenticatedRequest(url, options = {}) {
  const token = localStorage.getItem('authToken');

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    // token expirado, refrescar
    const refreshed = await refreshToken();
    if (!refreshed) {
      return null; // falló, usuario debe hacer login
    }
    // reintentar request con nuevo token
    return makeAuthenticatedRequest(url, options);
  }

  return response;
}
```

---

## parte 3: guía de consumo de endpoints para frontend

### configuración inicial

#### base URL

todos los endpoints están disponibles en:
```
http://localhost:3000
```

en producción cambiar a la URL del servidor real.

#### headers requeridos

para GraphQL:
```
Content-Type: application/json
Authorization: Bearer <token> (solo para mutations autenticadas)
```

para REST:
```
Content-Type: application/json
Authorization: Bearer <token> (solo endpoints que lo requieren)
```

#### variables de entorno recomendadas

en frontend (.env o .env.local):
```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_GRAPHQL_URL=http://localhost:3000/graphql
```

### consumo de endpoints GraphQL product

#### ejemplo 1: listar productos con paginación

```javascript
async function getProducts(page = 1, limit = 10) {
  const query = `
    query GetProducts($page: Int, $limit: Int) {
      products(page: $page, limit: $limit) {
        data {
          id
          name
          description
          slug
          created_at
        }
        total
        page
        limit
        pages
      }
    }
  `;

  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { page, limit }
    })
  });

  const { data } = await response.json();
  return data.products;
}

// uso:
const productList = await getProducts(1, 20);
console.log(`encontrados ${productList.total} productos`);
```

#### ejemplo 2: buscar productos por nombre

```javascript
async function searchProducts(searchTerm, page = 1) {
  const query = `
    query SearchProducts($search: String, $page: Int) {
      products(search: $search, page: $page) {
        data {
          id
          name
          slug
        }
        total
      }
    }
  `;

  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { search: searchTerm, page }
    })
  });

  const { data } = await response.json();
  return data.products;
}

// uso:
const results = await searchProducts('zapatillas');
```

#### ejemplo 3: obtener producto por slug

```javascript
async function getProductBySlug(slug) {
  const query = `
    query GetProductBySlug($slug: String!) {
      productBySlug(slug: $slug) {
        id
        name
        description
        slug
        meta_title
        meta_description
        variants {
          id
          sku
          prices {
            amount
            currency
          }
        }
      }
    }
  `;

  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { slug }
    })
  });

  const { data } = await response.json();
  return data.productBySlug;
}

// uso: en página /productos/nombre-producto
const product = await getProductBySlug('nombre-producto');
document.title = product.meta_title;
```

#### ejemplo 4: obtener producto por ID con variantes

```javascript
async function getProductDetails(productId) {
  const query = `
    query GetProduct($id: String!) {
      product(id: $id) {
        id
        name
        description
        promotionable
        variants {
          id
          sku
          weight
          is_master
          cost_price
          cost_currency
          prices {
            id
            amount
            currency
            compare_at_amount
          }
        }
        created_at
        updated_at
      }
    }
  `;

  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { id: productId }
    })
  });

  const { data, errors } = await response.json();

  if (errors) {
    console.error('error consultando producto:', errors);
    return null;
  }

  return data.product;
}
```

#### ejemplo 5: crear producto (requiere autenticación)

```javascript
async function createProduct(productData, token) {
  const mutation = `
    mutation CreateProduct($input: CreateProductInput!) {
      createProduct(createProductInput: $input) {
        id
        name
        slug
        created_at
      }
    }
  `;

  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          name: productData.name,
          description: productData.description,
          slug: productData.slug,
          meta_title: productData.meta_title,
          meta_description: productData.meta_description,
          promotionable: productData.promotionable
        }
      }
    })
  });

  const { data, errors } = await response.json();

  if (errors) {
    console.error('error creando producto:', errors);
    return null;
  }

  return data.createProduct;
}

// uso:
const token = localStorage.getItem('authToken');
const newProduct = await createProduct({
  name: 'nuevo producto',
  description: 'descripción del producto',
  slug: 'nuevo-producto',
  meta_title: 'producto nuevo | tienda',
  promotionable: true
}, token);
```

#### ejemplo 6: actualizar producto (requiere autenticación)

```javascript
async function updateProduct(productId, updateData, token) {
  const mutation = `
    mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {
      updateProduct(id: $id, updateProductInput: $input) {
        id
        name
        description
        updated_at
      }
    }
  `;

  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        id: productId,
        input: updateData // solo incluir campos que cambiaron
      }
    })
  });

  const { data, errors } = await response.json();

  if (errors) {
    console.error('error actualizando producto:', errors);
    return null;
  }

  return data.updateProduct;
}

// uso:
const token = localStorage.getItem('authToken');
const updated = await updateProduct('uuid-del-producto', {
  name: 'nombre actualizado',
  description: 'nueva descripción'
}, token);
```

#### ejemplo 7: eliminar producto (requiere autenticación)

```javascript
async function deleteProduct(productId, token) {
  const mutation = `
    mutation RemoveProduct($id: String!) {
      removeProduct(id: $id)
    }
  `;

  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: mutation,
      variables: { id: productId }
    })
  });

  const { data, errors } = await response.json();

  if (errors) {
    console.error('error eliminando producto:', errors);
    return false;
  }

  return data.removeProduct;
}

// uso:
const token = localStorage.getItem('authToken');
const deleted = await deleteProduct('uuid-del-producto', token);
if (deleted) {
  console.log('producto eliminado correctamente');
}
```

### consumo de endpoints REST autenticación

#### cliente HTTP recomendado

para pruebas rápidas usar curl:
```bash
curl -X GET http://localhost:3000/auth/validate \
  -H "Authorization: Bearer token-aqui"
```

para aplicaciones JavaScript:
```javascript
const response = await fetch(url, {
  method: 'GET/POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token-aqui'
  }
});
```

#### wrapper de fetch autenticado (recomendado)

```javascript
class AuthenticatedFetch {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  setToken(token) {
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    localStorage.removeItem('authToken');
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });

    // si 401, intentar refrescar token
    if (response.status === 401 && token) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // reintentar request
        return this.request(endpoint, options);
      } else {
        // token no se puede refrescar, limpiar y redirigir
        this.clearToken();
        window.location.href = '/login';
        return null;
      }
    }

    return response;
  }

  async refreshToken() {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    });

    if (response.ok) {
      const { token } = await response.json();
      this.setToken(token);
      return true;
    }

    return false;
  }

  async login(email, password) {
    const response = await fetch(`${this.baseUrl}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const { token, user } = await response.json();
      this.setToken(token);
      return { token, user };
    }

    return null;
  }

  async signup(email, password, name) {
    const response = await fetch(`${this.baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });

    if (response.ok) {
      const { token, user } = await response.json();
      this.setToken(token);
      return { token, user };
    }

    return null;
  }

  async logout() {
    await this.request('/auth/sign-out', { method: 'POST' });
    this.clearToken();
  }

  async validateSession() {
    const response = await this.request('/auth/validate', { method: 'GET' });
    if (response) {
      return await response.json();
    }
    return { valid: false };
  }
}

// uso global:
const api = new AuthenticatedFetch();

// login
const { token, user } = await api.login('usuario@ejemplo.com', 'contraseña');

// hacer requests autenticados
const response = await api.request('/auth/session');
const session = await response.json();

// logout
await api.logout();
```

---

## resumen de cambios

### archivos creados

#### módulo product
- src/product/product.module.ts
- src/product/product.service.ts
- src/product/product.resolver.ts
- src/product/entities/product.entity.ts
- src/product/entities/variant.entity.ts
- src/product/entities/price.entity.ts
- src/product/entities/product-connection.entity.ts
- src/product/dto/create-product.input.ts
- src/product/dto/update-product.input.ts
- src/product/dto/filter-products.input.ts

#### módulo autenticación (complementarios)
- src/auth/auth.controller.ts (con endpoints REST adicionales)
- src/auth/dto/change-password.input.ts
- src/auth/dto/reset-password.input.ts

### archivos modificados

- src/app.module.ts - agregado ProductModule en imports

### características implementadas

#### producto
- crear, leer, actualizar, eliminar (CRUD) con soft delete
- paginación con metadatos (total, page, limit, pages)
- búsqueda por nombre y descripción
- filtrado por slug
- soporte para variantes y precios

#### autenticación
- endpoints REST complementarios (session, validate, sign-out, refresh)
- cambio de contraseña
- manejo de tokens JWT
- validación de sesión

### estándares de código

- comentarios minúsculos, 6-10 palabras máximo
- patrón service→resolver→entity
- validación con class-validator en DTOs
- manejo de errores con excepciones NestJS
- soft delete para integridad de datos
- compilación sin errores (0 warnings/errors)

---

## notas importantes para frontend

1. **autorización**: mutations de producto requieren token válido. queries son públicas.

2. **paginación**: productBySlug no usa paginación, es endpoint directo. products retorna ProductConnection con metadatos.

3. **soft delete**: productos eliminados no aparecen en resultados. usar uuid correcto en queries.

4. **búsqueda**: search busca simultáneamente en name y description (case-insensitive).

5. **tokens**: usar localStorage/sessionStorage para persistencia. refrescar antes de expirar.

6. **errores graphql**: revisar array `errors` en respuesta, no solo `data`.

7. **cors**: si frontend está en otro puerto, configurar CORS en backend.

8. **ambiente**: cambiar base URL según sea desarrollo/staging/producción.

---

documento generado: 4 de marzo de 2026
responsable: samuel moreno
proyecto: correos de méxico backend
versión: 1.0
