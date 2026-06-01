# Tab Store

Manages the morphing navigation bar that transforms between a standard bottom tab bar, a floating detached modal, and a gesture-driven bottom sheet. Includes a navigation stack for nested content flows.

---

## Modes

```
Navigation               Detached                 Bottom Sheet
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│ Tab Buttons  │   →    │ Custom UI    │   →    │ Scrollable   │
│ [Home][Shop] │        │ [Content]    │        │ [Content]    │
└──────────────┘        └──────────────┘        └──◎───────────┘
                              ↑                   snap points
                         goBack() / dismissDetached()
```

- **navigation** — standard tab bar with route buttons
- **detached** — floating bar with arbitrary content, optional backdrop
- **bottom sheet** — detached + gesture snap points + scroll support

---

## Tab Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `backgroundColor` | `string` | theme surface | Bar background color |
| `bottomSpacing` | `number` | `0` | Pixels from screen bottom (`0` = flush) |
| `width` | `"full"` \| `"default"` | `"full"` | `"full"` = screen width, `"default"` = 350px centered |
| `outsideTouchAction` | `() => void` | `undefined` | Called when tapping the backdrop in detached mode |
| `backdropColor` | `string` | `"transparent"` | Backdrop color — only rendered when `outsideTouchAction` is set |
| `enableBottomSheet` | `boolean` | `false` | Enables gesture-driven snap points |
| `snapPoints` | `number[]` | `undefined` | Snap positions as screen-height fractions (e.g. `[0.4, 0.9]`). Requires ≥ 2 values, auto-sorted ascending |
| `initialSnapIndex` | `number` | `0` | Index into `snapPoints` to start at |
| `footerContent` | `() => ReactNode` | `undefined` | Rendered below the scroll area, fixed at the bottom of the sheet. Only applies when `enableBottomSheet` is true |

---

## Actions

### `showDetached(content, options?)`

The main entry point. Switches to detached mode, sets content, and clears history. Options merge on top of detached defaults (`bottomSpacing: 27`, `width: "default"`).

```typescript
const { showDetached, dismissDetached } = useTabActions();

showDetached(
  () => <SettingsMenu />,
  {
    backdropColor: "rgba(0,0,0,0.5)",
    outsideTouchAction: dismissDetached,
  }
);
```

With bottom sheet:

```typescript
showDetached(
  () => <PlaceDetails />,
  {
    enableBottomSheet: true,
    snapPoints: [0.4, 0.92],
    initialSnapIndex: 0,
    outsideTouchAction: dismissDetached,
    footerContent: () => <Button onPress={handleBook}>Reservar</Button>,
  }
);
```

### `dismissDetached()`

Returns to navigation mode. Restores previous options and clears history.

### `updateOptions(options)`

Merges partial options into current without changing mode. Useful for live updates like adjusting spacing on scroll.

```typescript
updateOptions({ bottomSpacing: 16 });
```

### `pushContent(content, options?)`

Navigates to new content, saving the current screen to the history stack.

```typescript
// In SettingsMenu
pushContent(() => <LanguageSelector />);
```

### `goBack()`

Pops history and restores the previous screen. If history is empty, dismisses to navigation.

Returns `true` if history was popped, `false` if dismissed.

### `canGoBack()`

Returns `true` if there is history to go back to.

```typescript
{canGoBack() ? <BackButton onPress={goBack} /> : <CloseButton onPress={goBack} />}
```

### `clearHistory()`

Clears the history stack without dismissing. Use after actions where going back shouldn't be possible (checkout, login success).

### `popToRoot()`

Jumps back to the first entry in the history stack, clearing all screens in between. The root content and its original options (including `footerContent`) are fully restored. Does nothing if there is no history.

```typescript
// In a booking success screen — go back to the place details without
// letting the user navigate back through the booking flow
const { popToRoot } = useTabActions();
<Button onPress={popToRoot}>Volver al lugar</Button>
```

### `snapToIndex(index)`

Programmatically snaps to a specific snap point. Returns `false` if bottom sheet is not enabled or the index is out of range.

```typescript
snapToIndex(1); // snap to second point
```

### `expandToMax()` / `collapseToMin()`

Convenience wrappers for snapping to the highest or lowest snap point.

### `setDetachedContent(content)`

Replaces current content without touching mode or history. Use when you want to swap content but prevent going back.

### `reset()`

Resets everything to initial navigation state.

---

## Hooks

All hooks use granular selectors — components only re-render when the specific slice they care about changes.

| Hook | Returns | Re-renders when |
|------|---------|----------------|
| `useTabMode()` | `"navigation" \| "detached"` | mode changes |
| `useTabOptions()` | `TabOptions` | any option value changes (shallow) |
| `useDetachedContent()` | `(() => ReactNode) \| null` | content reference changes |
| `useTabActions()` | all actions | never (stable references) |
| `useTabHistory()` | `number` (stack depth) | history length changes |
| `useBottomSheetState()` | `{ isEnabled, snapPoints, currentSnapIndex }` | snap state changes (shallow) |

---

## Usage Examples

### Simple modal

```typescript
function MapButton() {
  const { showDetached, dismissDetached } = useTabActions();

  return (
    <Button
      onPress={() =>
        showDetached(() => <FilterPanel />, {
          outsideTouchAction: dismissDetached,
          backdropColor: "rgba(0,0,0,0.4)",
        })
      }
    />
  );
}
```

### Bottom sheet with snap points and footer

```typescript
function PlaceCard({ place }) {
  const { showDetached, dismissDetached } = useTabActions();

  return (
    <Pressable
      onPress={() =>
        showDetached(() => <PlaceDetails place={place} />, {
          enableBottomSheet: true,
          snapPoints: [0.4, 0.92],
          outsideTouchAction: dismissDetached,
          footerContent: () => <Button>Reservar</Button>,
        })
      }
    />
  );
}
```

### Multi-level navigation

```typescript
function SettingsMenu() {
  const { pushContent, goBack } = useTabActions();

  return (
    <View>
      <Button onPress={goBack}>Close</Button>
      <Button onPress={() => pushContent(() => <LanguageSettings />)}>Language</Button>
      <Button onPress={() => pushContent(() => <ThemeSettings />)}>Theme</Button>
    </View>
  );
}

function LanguageSettings() {
  const { goBack } = useTabActions();
  return (
    <View>
      <Button onPress={goBack}>← Back</Button>
    </View>
  );
}
```

### Clear history after a key action

```typescript
function CheckoutFlow() {
  const { pushContent, clearHistory } = useTabActions();

  const onPaymentSuccess = () => {
    clearHistory(); // user can't navigate back to payment
    pushContent(() => <OrderSuccess />);
  };
}
```

---

## Dos and Don'ts

**Do** use granular hooks — each component subscribes only to what it needs:
```typescript
const mode = useTabMode();           // re-renders on mode change only
const options = useTabOptions();     // re-renders on options change only
const { showDetached } = useTabActions(); // never re-renders
```

**Don't** select the whole store:
```typescript
const store = useTabStore((s) => s); // re-renders on every state change
```

**Do** use `showDetached` as your entry point — it sets content, switches mode, and validates snap points in one call.

**Don't** manually chain `setMode` + `setDetachedContent` — it's error-prone and skips snap point validation.

---

## Type Definitions

```typescript
type TabMode = "navigation" | "detached";

type TabOptions = {
  backgroundColor: string;
  bottomSpacing: number;
  width: "default" | "full";
  outsideTouchAction?: () => void;
  backdropColor: string;
  enableBottomSheet?: boolean;
  snapPoints?: number[];       // fractions of screen height, e.g. [0.4, 0.9]
  initialSnapIndex?: number;
  footerContent?: () => React.ReactNode; // fixed at sheet bottom, outside scroll
};

type HistoryEntry = {
  content: () => React.ReactNode;
  options: TabOptions;
};
```

---

## Related Files

- `navigation/store/tab-store.tsx` — store implementation
- `navigation/hooks/use-tab-bar-animations.ts` — animation logic
- `navigation/hooks/use-bottom-sheet-gesture.ts` — gesture handling
- `navigation/hooks/use-snap-points-calculations.ts` — snap point math
- `navigation/components/custom-tab.tsx` — tab bar component
