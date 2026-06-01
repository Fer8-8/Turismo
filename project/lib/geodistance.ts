/**
 * Enumeration of Earth's radius for a given distance unit
 */
const EarthRadius = {
  FEET: 2.0925e7,
  KILOMETERS: 6378.0,
  METERS: 6_378_000.0,
  MILES: 3963.0,
} as const;

type CoordinatePoint = {
  latitude: number;
  longitude: number;
};

/**
 * Convert degrees → radians
 */
function convertToRadians(point: CoordinatePoint): CoordinatePoint {
  const DEGREE_DIVIDER = 57.295_779_513_082_32;

  return {
    latitude: point.latitude / DEGREE_DIVIDER,
    longitude: point.longitude / DEGREE_DIVIDER,
  };
}

/**
 * Get distance between two points (default: kilometers)
 */
export function getDistance(
  from: CoordinatePoint,
  to: CoordinatePoint,
  precision = 2,
  radius: number = EarthRadius.KILOMETERS
): number {
  const point1 = convertToRadians(from);
  const point2 = convertToRadians(to);

  const result = Math.acos(
    Math.sin(point1.latitude) * Math.sin(point2.latitude) +
      Math.cos(point1.latitude) *
        Math.cos(point2.latitude) *
        Math.cos(point1.longitude - point2.longitude)
  );

  const distance = radius * result;

  return Number.parseFloat(distance.toFixed(precision));
}
