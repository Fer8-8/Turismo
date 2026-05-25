# guía de integración frontend - backend graphql

---

## tabla de contenidos

1. [conectar a backend](#conectar-a-backend)
2. [graphql client setup](#graphql-client-setup)
3. [autenticación (betterauth)](#autenticación-betterauth)
4. [multi-tenancy (store context)](#multi-tenancy-store-context)
5. [manejo de errores](#manejo-de-errores)
6. [ejemplos por módulo](#ejemplos-por-módulo)
7. [testing local](#testing-local)
8. [environment variables](#environment-variables)

---

## conectar a backend

### endpoint graphql

```
http://localhost:3000/graphql
```

**método**: post  
**headers requeridos**:
```
content-type: application/json
x-store-id: {store-uuid}  # obligatorio (excepto en @skipstorecontext queries)
authorization: Bearer {jwt-token}  # si requiere autenticación
```

### prueba rápida (curl)

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "X-Store-Id: store-123" \
  -d '{
    "query": "query { countries { id name } }"
  }'
```

---

## graphql client setup

### opción 1: apollo client (recomendado)

#### instalación (web)

```bash
npm install @apollo/client graphql
```

#### configuración

```typescript
// src/apollo.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:3000/graphql',
  
  // inyectar headers automáticamente
  request: async (operation) => {
    const token = localStorage.getItem('auth_token');
    const storeId = localStorage.getItem('current_store_id');

    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (storeId) {
      headers['X-Store-Id'] = storeId;
    } else if (!operation.operationName?.includes('Countries')) {
      // si la query no es global, requiere store_id
      throw new Error('Missing X-Store-Id header');
    }

    operation.setContext({ headers });
  },
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

#### uso en react

```typescript
import { useQuery, useMutation } from '@apollo/client';
import { GET_ORDERS, CREATE_ORDER } from './queries';

function OrdersList() {
  const { data, loading, error } = useQuery(GET_ORDERS);
  const [createOrder] = useMutation(CREATE_ORDER);

  if (loading) return <p>loading...</p>;
  if (error) return <p>error: {error.message}</p>;

  return (
    <div>
      {data.orders.map(order => (
        <div key={order.id}>{order.id}</div>
      ))}
    </div>
  );
}
```

### opción 2: tanstack query + fetch

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

const fetchGraphQL = async (query: string, variables?: object) => {
  const response = await fetch(process.env.REACT_APP_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Store-Id': localStorage.getItem('current_store_id') || '',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) throw new Error('graphql request failed');
  
  const result = await response.json();
  
  if (result.errors) throw new Error(result.errors[0].message);
  
  return result.data;
};

// uso
const { data } = useQuery({
  queryKey: ['orders'],
  queryFn: () => fetchGraphQL(`query { orders { id total } }`),
});
```

### opción 3: urql (alternative)

```bash
npm install urql graphql
```

```typescript
import { createClient } from 'urql';

const client = createClient({
  url: process.env.REACT_APP_GRAPHQL_URL,
  fetchOptions: () => ({
    headers: {
      'X-Store-Id': localStorage.getItem('current_store_id') || '',
    },
  }),
});
```

---

## autenticación (betterauth)

### flow de login

el backend usa **betterauth** (jwt + sesiones).

```typescript
// frontend - login
async function login(email: string, password: string) {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const { token, user } = await response.json();

  // guardar token
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user_id', user.id);
  
  // guardar tiendas del usuario
  localStorage.setItem('user_stores', JSON.stringify(user.store_ids));

  return user;
}
```

### headers automáticos

```typescript
// en cada request a graphql, incluir:
headers: {
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  'X-Store-Id': localStorage.getItem('current_store_id'),
}
```

---

## multi-tenancy (store context)

### ¿qué es x-store-id?

es un **uuid** que identifica la tienda (empresa/sucursal) en contexto de multi-tenancy.

```
X-Store-Id: 550e8400-e29b-41d4-a716-446655440000
```

### cómo obtenerlo

```typescript
// opción 1: el usuario elige entre sus tiendas
const stores = JSON.parse(localStorage.getItem('user_stores'));

function selectStore(storeId: string) {
  localStorage.setItem('current_store_id', storeId);
  // recargar datos
  window.location.reload();
}

// opción 2: guardar última tienda usada
function setDefaultStore(storeId: string) {
  localStorage.setItem('current_store_id', storeId);
}
```

### inyección automática (apollo)

```typescript
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL,
  request: (operation) => {
    const storeId = localStorage.getItem('current_store_id');
    if (!storeId) {
      throw new Error('No store selected. Call setDefaultStore() first.');
    }
    operation.setContext({
      headers: {
        'X-Store-Id': storeId,
      },
    });
  },
});
```

---

## manejo de errores

### estructura de error graphql

```typescript
// response cuando hay error
{
  "errors": [
    {
      "message": "validation failed",
      "extensions": {
        "code": "VALIDATION_ERROR",
        "errors": {
          "email": ["email must be valid"],
          "name": ["name is required"]
        }
      }
    }
  ]
}
```

### parsing de errores

```typescript
function parseGraphQLError(error: ApolloError) {
  const extensions = error.graphQLErrors[0]?.extensions;
  
  switch (extensions?.code) {
    case 'VALIDATION_ERROR':
      return {
        type: 'validation',
        errors: extensions.errors,  // { field: [messages] }
      };

    case 'NOT_FOUND':
      return {
        type: 'notFound',
        message: error.message,
      };

    case 'CONFLICT':
      return {
        type: 'conflict',
        message: error.message,  // "email already exists"
      };

    case 'BUSINESS_RULE_VIOLATION':
      return {
        type: 'businessError',
        message: error.message,  // "insufficient stock"
      };

    case 'MISSING_STORE_ID':
      return {
        type: 'storeContext',
        message: 'select a store first',
      };

    case 'UNAUTHORIZED_ACCESS':
      return {
        type: 'unauthorized',
        message: 'you do not have access to this',
      };

    default:
      return {
        type: 'unknown',
        message: error.message,
      };
  }
}

// uso
try {
  await createOrder(variables);
} catch (error) {
  const parsed = parseGraphQLError(error);
  
  if (parsed.type === 'validation') {
    showFieldErrors(parsed.errors);
  } else if (parsed.type === 'businessError') {
    showToast(parsed.message);
  }
}
```

---

## ejemplos por módulo

### shared module - pagination

#### query

```graphql
query GetProducts($offset: Int, $limit: Int) {
  products(offset: $offset, limit: $limit) {
    items {
      id
      name
      description
    }
    totalCount
    hasMore
  }
}
```

#### uso en react

```typescript
const { data } = useQuery(GET_PRODUCTS, {
  variables: {
    offset: 0,
    limit: 20,
  },
});

// data.products = {
//   items: [...],
//   totalCount: 150,
//   hasMore: true
// }
```

---

### shared module - store context

#### queries que requieren x-store-id

```graphql
query GetOrders {
  orders {
    id
    total
    state
  }
}
```

```typescript
// falla sin header
const { data } = useQuery(GET_ORDERS);
// error: "missing required header x-store-id"

// funciona con header
const { data } = useQuery(GET_ORDERS, {
  context: {
    headers: {
      'X-Store-Id': 'store-123',
    },
  },
});
```

#### queries globales (sin x-store-id)

```graphql
query GetCountries {
  countries {
    id
    name
  }
}
```

```typescript
// funciona sin store_id (está marcado con @skipstorecontext)
const { data } = useQuery(GET_COUNTRIES);
```

---

### shared module - errores

#### manejo de validation_error

```typescript
const [createOrder, { loading, error }] = useMutation(CREATE_ORDER);

function OrderForm() {
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(formData) {
    try {
      await createOrder({ variables: formData });
    } catch (error) {
      const parsed = parseGraphQLError(error);
      
      if (parsed.type === 'validation') {
        setFieldErrors(parsed.errors);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" />
      {fieldErrors.email && (
        <span className="error">{fieldErrors.email[0]}</span>
      )}
    </form>
  );
}
```

---

## testing local

### requisitos previos

1. backend ejecutándose:
```bash
cd backend
npm run start:dev
```

2. graphql disponible en `http://localhost:3000/graphql`

### con apollo studio (recomendado)

apollo studio carga automáticamente el schema cuando accedes a `/graphql`:

```
http://localhost:3000/graphql
```

ves un ide interactivo donde puedes:
- escribir queries/mutations
- ver documentación automática
- debuggear requests/responses
- guardar queries favoritas

### script para probar headers

```typescript
// test-graphql.ts
async function testGraphQL() {
  const query = `
    query {
      orders {
        id
        total
      }
    }
  `;

  // sin header
  console.log('--- sin x-store-id ---');
  let response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  let data = await response.json();
  console.log(data);
  // error: "missing required header x-store-id"

  // con header
  console.log('\n--- con x-store-id ---');
  response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Store-Id': 'store-550e8400-e29b-41d4-a716-446655440000',
    },
    body: JSON.stringify({ query }),
  });
  data = await response.json();
  console.log(data);
  // success: { data: { orders: [...] } }
}

testGraphQL();
```

### postman / insomnia

1. crear request post a `http://localhost:3000/graphql`
2. body (raw, graphql):
```graphql
query {
  orders {
    id
    total
  }
}
```
3. headers:
```
X-Store-Id: store-550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
```

---

## environment variables

### frontend (.env)

```bash
# .env.development
REACT_APP_GRAPHQL_URL=http://localhost:3000/graphql
REACT_APP_API_URL=http://localhost:3000

# .env.production
REACT_APP_GRAPHQL_URL=https://api.correosdemexico.com/graphql
REACT_APP_API_URL=https://api.correosdemexico.com
```

### backend (.env)

```bash
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/correos_db
PORT=3000
NODE_ENV=development

# betterauth
AUTH_SECRET=your-secret-key

# cors
CORS_ORIGIN=http://localhost:3001,http://localhost:3000
```

---

## checklist para frontend

- [ ] apollo client (u otro) instalado y configurado
- [ ] `x-store-id` inyectado automáticamente en headers
- [ ] token jwt guardado después de login
- [ ] manejo de errores implementado (validación, negocio, etc.)
- [ ] graphql queries/mutations generadas desde schema
- [ ] testing local en apollo studio
- [ ] variables de entorno configuradas

---

## flujo completo: login → órdenes

### 1. login

```typescript
// frontend/src/auth.ts
async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const { token, user } = await response.json();

  // guardar
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user_id', user.id);
  localStorage.setItem('user_stores', JSON.stringify(user.storeIds));

  // seleccionar primera tienda por defecto
  localStorage.setItem('current_store_id', user.storeIds[0]);

  return user;
}
```

### 2. configurar apollo client

```typescript
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL,
  request: (operation) => {
    const token = localStorage.getItem('auth_token');
    const storeId = localStorage.getItem('current_store_id');

    operation.setContext({
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(storeId && { 'X-Store-Id': storeId }),
      },
    });
  },
});
```

### 3. query órdenes

```typescript
const GET_ORDERS = gql`
  query GetOrders($offset: Int, $limit: Int) {
    orders(offset: $offset, limit: $limit) {
      items {
        id
        total
        state
        createdAt
      }
      totalCount
      hasMore
    }
  }
`;

function OrdersList() {
  const { data, loading } = useQuery(GET_ORDERS, {
    variables: { offset: 0, limit: 20 },
  });

  if (loading) return <p>cargando...</p>;

  return (
    <div>
      {data.orders.items.map(order => (
        <div key={order.id}>
          orden {order.id} - ${order.total}
        </div>
      ))}
    </div>
  );
}
```

---

## troubleshooting común

### error: "missing required header x-store-id"

**causa**: query requiere `x-store-id` pero no se envió.

**solución**:
```typescript
// asegúrate de que está guardado
console.log(localStorage.getItem('current_store_id'));

// o inyectalo explícitamente
useQuery(GET_ORDERS, {
  context: {
    headers: {
      'X-Store-Id': 'store-uuid-aquí',
    },
  },
});
```

### error: "unauthorized" (401)

**causa**: token jwt expirado o inválido.

**solución**:
```typescript
// verificar que token existe
console.log(localStorage.getItem('auth_token'));

// hacer login de nuevo
await login(email, password);
```

### error: "validation failed"

**causa**: input no cumple validaciones.

**solución**:
```typescript
try {
  await createOrder(variables);
} catch (error) {
  const { errors } = error.graphQLErrors[0].extensions;
  console.log(errors);
  // { email: ['must be valid'], name: ['is required'] }
}
```

### "cannot get /graphql" (404)

**causa**: backend no está corriendo.

**solución**:
```bash
# terminal 1 - backend
cd backend
npm run start:dev
# debe mostrar: "listening on port 3000"

# terminal 2 - frontend
npm start
```

---

## contacto con backend

**para preguntas sobre el schema graphql**:
1. ver documentación en `/graphql` (apollo studio)
2. contactar equipo backend
3. revisar especificación de módulos: `MODULOS_Y_DOMINIOS_ESPECIFICACION.md`

---

## resumen

| concepto | frontend |
|----------|----------|
| **endpoint** | `http://localhost:3000/graphql` |
| **auth** | jwt en header `authorization: bearer {token}` |
| **multi-tenancy** | header `x-store-id: {uuid}` (automático vía apollo) |
| **graphql client** | apollo client / tanstack query / urql |
| **errores** | parsing de `extensions.code` + `extensions.errors` |
| **testing** | apollo studio en `/graphql` |
| **ide** | apollo studio (built-in) |


