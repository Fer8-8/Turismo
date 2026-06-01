# Hooks documentation
## Overview
Hooks in the `hooks` directory are custom hooks shared across the app. For feature-specific hooks, they should be placed in the `features` directory.

# useUserLocation
## Overview 
The `useUserLocation` hook fetches the user's current location using `expo-location`. It automatically requests location permissions and retrieves the city, country, region, and coordinates on mount.

## Return Value
The hook returns an object with the following properties:

| Property | Type | Description |
| --- | --- | --- |
| city | `string` \| `null` | The user's city. |
| country | `string` \| `null` | The user's country. |
| region | `string` \| `null` | The user's region/state. |
| latitude | `number` \| `null` | The user's latitude coordinate. |
| longitude | `number` \| `null` | The user's longitude coordinate. |
| error | `string` \| `null` | Error message if location fetch fails or permission is denied. |
| isLoading | `boolean` | `true` while fetching location, `false` when complete. |

## Usage

**Basic Example:**
```typescript
const location = useUserLocation();

if (location.isLoading) {
  return <Loading />;
}

if (location.error) {
  return <Error message={location.error} />;
}

return (
  <Text>
    {location.city}, {location.country}
  </Text>
);
```

**Destructured Example:**
```typescript
const { city, country, isLoading, error } = useUserLocation();

if (isLoading) {
  return <Text>Fetching your location...</Text>;
}

if (error) {
  return <Text>Could not get location: {error}</Text>;
}

return <Text>You are in {city}, {country}</Text>;
```

**Using Coordinates:**
```typescript
const { latitude, longitude, isLoading } = useUserLocation();

if (isLoading || !latitude || !longitude) {
  return <Loading />;
}

return (
  <MapView
    initialRegion={{
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
  />
);
```

## Notes
- Location is fetched automatically on component mount
- The hook requests foreground location permissions
- If permission is denied, `error` will be set to `"Permission denied"`
- Uses `LocationAccuracy.Balanced` (Accurate to within one hundred meters).
