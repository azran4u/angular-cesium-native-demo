export interface Coordinate {
  longitude: number;
  latitude: number;
  height?: number;
}

export type MapEntityId = string;

export interface MapEntity {
  id: MapEntityId;
  label?: string;
  coordinate: Coordinate;
}

export interface AirTrackMapEntity extends MapEntity {}

export enum MAP_LAYERS {
  AIR_TRACK_LAYER = 'AIR_TRACK_LAYER',
  POLYGON_LAYER = 'POLYGON_LAYER',
}
