export type Coordinate = {
  lat: number;
  lng: number;
};

export type RouteMode = number;

export type RouteData = {
  distance: number;
  elevationGain: number;
  path: Coordinate[];
};
