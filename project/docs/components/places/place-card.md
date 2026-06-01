# Place Card

A composable card component used in the **Places** feature.

It displays an image with a title and subtitle, and can be pressable.

Designed for grids and lists of places.

---

## Import

```ts
import {
  PlacePressableCard,
  PlaceCardMedia,
  PlaceCardFooter,
  PlaceCardTitle,
  PlaceCardSubtitle,
} from "@/features/places/components/place-card";
```

---

## Components

### `PlacePressableCard`

Wrapper around `Pressable`.

**Props:**  
All standard `PressableProps`.

---

### `PlaceCardMedia`

Displays the place image.

**Props:**  
All `ImageProps` from `expo-image`.

---

### `PlaceCardFooter`

Container for text content below the image.

**Props:**  
All standard `ViewProps`.

---

### `PlaceCardTitle`

Styled title text.

**Default:**
- `variant`: `"body"`
- `color`: `"title"`

**Props:**  
All `ThemedTextProps`.

---

### `PlaceCardSubtitle`

Styled subtitle text.

**Default:**
- `variant`: `"caption"`
- `color`: `"foreground"`

**Props:**  
All `ThemedTextProps`.

---

## Example

```tsx
<PlacePressableCard onPress={() => console.log("pressed")}>
  <PlaceCardMedia
    source={{ uri: "https://example.com/image.jpg" }}
  />
  <PlaceCardFooter>
    <PlaceCardTitle>Loreto</PlaceCardTitle>
    <PlaceCardSubtitle>
      Baja California Sur
    </PlaceCardSubtitle>
  </PlaceCardFooter>
</PlacePressableCard>
```

## Notes
- Designed to be show on rows, with two columns.
