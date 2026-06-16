export type Coordinate = {
  lat: number;
  lng: number;
};

export type RouteMode = 'time' | 'distance';
export type VelocityModel = 'glm' | 'tobler' | 'naismith';

export type SlopeCharacteristics = {
  average_slope_deg: number;
  max_slope_deg: number;
  uphill_meters: number;
  downhill_meters: number;
  flat_meters: number;
  uphill_ratio: number;
  downhill_ratio: number;
  flat_ratio: number;
};

export type RouteData = {
  distance: number;
  elevationGain: number;
  path: Coordinate[];
  travelTime?: number;
  slopeCharacteristics?: SlopeCharacteristics;
  mode?: RouteMode;
  lambdaValue?: number;
  ignoreDownhill?: boolean;
  modelType?: string;
  slopeMultiplier?: number;
};


