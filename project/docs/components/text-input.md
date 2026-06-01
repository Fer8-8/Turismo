# TextInput Component

A themed wrapper around React Native’s `TextInput`.

It provides consistent sizing, colors, rounded corners, and multiline support.

---

## Import

```ts
import { TextInput } from "@/components/TextInput";
```

---

## Props

This component supports all standard `TextInputProps`.

### `multiline`

Enables multi-line input styling.

```ts
multiline?: boolean;
```

When enabled:

- Height increases to `120`
- Vertical padding is added
- Text aligns to the top

---

### `editable`

Controls whether the input is editable.

```ts
editable?: boolean;
```

Default: `true`

When `false`:

- Input is not editable
- Opacity is reduced

---

## Behavior

- Uses themed background color
- Uses themed foreground color
- Applies muted placeholder color
- Disables internal scrolling
- Matches button height by default

---

## Examples

### Basic Input

```tsx
<TextInput placeholder="Email" />
```

---

### Multiline Input

```tsx
<TextInput
  multiline
  placeholder="Write your message..."
/>
```

---

### Disabled Input

```tsx
<TextInput
  editable={false}
  value="Read only value"
/>
```

---

## Styling

The input includes:

- Full width
- Button-sized height (single line)
- Rounded full border radius
- Continuous border curve
- Horizontal padding from theme spacing
- Themed surface background

You can override styles using the `style` prop.
