# Card Component

A simple surface container used to group related content.

It provides consistent background color, padding, and rounded corners.

---

## Import

```ts
import { Card } from "@/components/Card";
```

---

## Props

### `color`

Controls the background surface.

```ts
color?: "default" | "secondary";
```

Default: `"default"`

| Color       | Usage |
|------------|-------|
| `default`   | Secondary surface background |
| `secondary` | Primary surface background |

---

### Other Props

All standard `ViewProps` are supported.

You can pass layout styles, test IDs, accessibility props, etc.

---

## Examples

### Basic Card

```tsx
<Card>
  <Text>Card content</Text>
</Card>
```

---

### Secondary Surface

```tsx
<Card color="secondary">
  <Text>Secondary surface card</Text>
</Card>
```

---

### Custom Styling

```tsx
<Card style={{ marginBottom: 16 }}>
  <Text>Spaced card</Text>
</Card>
```

---

## Styling

The card includes:

- Extra large border radius
- Continuous border curve
- Medium internal padding
- Themed surface background

You can extend or override styles using the `style` prop.
