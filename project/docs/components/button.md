# Button Component

A themed, animated button built on top of `Pressable` and Reanimated.

It supports visual variants, accessibility defaults, and a subtle press animation.

---

## Import

```ts
import { Button } from "@/components/Button";
```

---

## Props

### `variant`

Controls the visual style of the button.

```ts
variant?: "default" | "inverse" | "secondary" | "danger";
```

Default: `"default"`

| Variant     | Usage |
|------------|-------|
| `default`   | Primary action |
| `secondary` | Neutral surface action |
| `inverse`   | inverse surfaces |
| `danger`    | Destructive actions |

---

### `disablePressAnimation`

Disables the scale animation on press.

```ts
disablePressAnimation?: boolean;
```

The animation is also automatically disabled if the user has reduced motion enabled.

---

### `disabled`

Disables the button and reduces opacity.

```ts
disabled?: boolean;
```

- Blocks press events  
- Applies reduced opacity  
- Updates accessibility state  

---

### `children`

You can pass:

- A string (automatically wrapped in `Text`)
- Custom content (icons, loaders, layouts)

```ts
children?: ReactNode;
```

If a string is passed, text color is handled automatically based on the variant.

---

### Other Props

All standard `PressableProps` are supported.

---

## Examples

### Primary Button

```tsx
<Button onPress={handleSubmit}>
  Continue
</Button>
```

---

### Secondary Button

```tsx
<Button variant="secondary" onPress={handleCancel}>
  Cancel
</Button>
```

---

### Danger Button

```tsx
<Button variant="danger" onPress={handleDelete}>
  Delete
</Button>
```

---

### Disabled Button

```tsx
<Button disabled>
  Disabled
</Button>
```

---

### Custom Content

```tsx
<Button>
  <Text variant="subtitle">Custom Content</Text>
</Button>
```

---

## Animation

On press:

- Scales to `0.98`
- Uses a spring animation
- Respects system reduced motion settings
- Can be disabled manually with `disablePressAnimation`

---

## Styling

The button uses:

- Fixed height: `54`
- Full border radius
- Horizontal padding from theme spacing
- Continuous border curve

You can override styles using the `style` prop.
