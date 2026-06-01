# useUserLocation Hook

A React hook that watches the user’s location and returns both coordinates and reverse-geocoded address information.

Built on top of `expo-location`.

---

## Import

```ts
import { useUserLocation } from "@/hooks/useUserLocation";
```

---

## What It Does

- Requests foreground location permission
- Watches the user’s position
- Reverse geocodes coordinates into:
  - City
  - Region
  - Country
- Updates automatically when the user moves
- Cleans up the subscription on unmount

---

## Return Value

```ts
{
  city: string | null
  country: string | null
  region: string | null
  latitude: number | null
  longitude: number | null
  error: string | null
  isLoading: boolean
}
```

### Fields

| Field       | Description |
|------------|------------|
| `city`      | Detected city name |
| `region`    | State or region |
| `country`   | Country name |
| `latitude`  | Current latitude |
| `longitude` | Current longitude |
| `error`     | Permission or location error |
| `isLoading` | Indicates permission or initial load state |

---

## Example

```tsx
const {
  city,
  country,
  latitude,
  longitude,
  error,
  isLoading,
} = useUserLocation();

if (isLoading) {
  return <Text>Loading location...</Text>;
}

if (error) {
  return <Text>{error}</Text>;
}

return (
  <Text>
    {city}, {country}
  </Text>
);
```

---

## Behavior Details

- Uses `LocationAccuracy.Balanced`
- Updates when the user moves approximately 1500 meters
- Automatically removes the location subscription when the component unmounts
- Returns `"Permission denied"` if access is not granted

---

## Notes

- Requires location permissions in `app.json`
- Works only on physical devices for accurate GPS data
- Reverse geocoding runs on every position update

Use this hook when you need real-time user location with readable address information.
