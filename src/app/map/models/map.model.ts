export interface Coordinate {
  longitude: number;
  latitude: number;
  height?: number;
}

export type MapEntityId = string;

export interface DrawableEntity {
  id: MapEntityId;
  coordinate: Coordinate;
}

export enum MAP_LAYERS {
  AIR_TRACK_LAYER = 'AIR_TRACK_LAYER',
  POLYGON_LAYER = 'POLYGON_LAYER',
  CLOSED_AREA = 'CLOSED_AREA',
  DEFAULT = 'DEFAULT',
}

