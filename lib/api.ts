import { Coordinate, RouteMode, RouteData } from './types';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

export const calculateRoute = async (
  origin: Coordinate,
  destination: Coordinate,
  lambdaValue: RouteMode
): Promise<RouteData> => {
  const response = await fetch(`${API_BASE_URL}/route`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      start: [origin.lat, origin.lng],
      end: [destination.lat, destination.lng],
      lambda: lambdaValue,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to calculate route');
  }

  const data = await response.json();

  // Convert path from [[lat, lon], ...] to [{lat, lng}, ...]
  const path: Coordinate[] = data.path.map((coord: number[]) => ({
    lat: coord[0],
    lng: coord[1],
  }));

  return {
    // Convert distance from meters to kilometers
    distance: Number((data.distance / 1000).toFixed(2)),
    elevationGain: Number(data.elevation_gain.toFixed(1)),
    path,
  };
};
