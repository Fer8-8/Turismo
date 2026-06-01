# Text Component

A themed wrapper around React Native’s `Text` component that standardizes typography, colors, and variants across the app.

It supports predefined typography variants, semantic colors, alignment, font weight overrides, and disabled state styling.

---

## Import

```ts
import { Text, AnimatedText } from "@/components/Text";
```

---

## Props

### `variant`

Defines the typography style.

```ts
variant?: "caption" | "body" | "bodySmall" | "subtitle" | "title" | "display";
```

Default: `"body"`

| Variant     | Font Weight | Usage Example |
|------------|------------|---------------|
| `caption`  | 500        | Helper text, small labels |
| `bodySmall`| 500        | Secondary content |
| `body`     | 500        | Default paragraph text |
| `subtitle` | 600        | Section subtitles |
| `title`    | 600        | Screen titles |
| `display`  | 800        | Large hero text |

---

### `color`

Semantic color selection.

```ts
color?: "foreground" | "muted" | "inverse" | "inverse-muted" | "title";
```

| Color            | Description |
|------------------|------------|
| `foreground`     | Default readable text |
| `muted`          | Secondary / low emphasis |
| `inverse`        | Text on primary backgrounds |
| `inverse-muted`  | Light muted text on dark surfaces |
| `title`          | High emphasis title color |

If not provided, the color defined by the selected `variant` will be used.

---

### `align`

Text alignment.

```ts
align?: TextStyle["textAlign"];
```

Example:

```tsx
<Text align="center">Centered text</Text>
```

---

### `fontWeight`

Override the default font weight.

```ts
fontWeight?: TextStyle["fontWeight"];
```

Example:

```tsx
<Text fontWeight="700">Bold text</Text>
```

---

### `disabled`

Applies reduced opacity and sets accessibility state.

```ts
disabled?: boolean;
```

When `true`, opacity is reduced to `0.4`.

---

### Other Props

All standard React Native `TextProps` are supported.

---

## Examples

### Basic Usage

```tsx
<Text>Hello world</Text>
```

---

### Title

```tsx
<Text variant="title">
  Screen Title
</Text>
```

---

### Muted Caption

```tsx
<Text variant="caption" color="muted">
  Optional helper text
</Text>
```

---

### Inverse Text

```tsx
<Text variant="subtitle" color="inverse">
  Text on primary background
</Text>
```

---

### Disabled State

```tsx
<Text disabled>
  Disabled text
</Text>
```

---

## AnimatedText

An animated version of the `Text` component using Reanimated.

```tsx
import { AnimatedText } from "@/components/Text";
```

Use it the same way as `Text`, but with animated styles.

```tsx
<AnimatedText style={animatedStyle}>
  Animated content
</AnimatedText>
```

---

## Notes

- Typography values come from the shared `FONT` theme.
- Colors come from the shared `THEME` object.
- Variants provide consistent visual hierarchy across the app.
- You can override styles using the `style` prop if needed.
