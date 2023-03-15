export interface Coordinate {
  longitude: number;
  latitude: number;
  height?: number;
  name?: string;
}

export type MapEntityId = string;

export interface DrawableEntity {
  id: MapEntityId;
}

export interface SingleCoordinateDrawableEntity extends DrawableEntity {
  coordinate: Coordinate;
};

export interface MultiCoordinateDrawableEntity extends DrawableEntity {
  coordinates: Coordinate[];
};


export enum MAP_LAYERS {
    AIR_TRACK_LAYER = 'AIR_TRACK_LAYER',
    TARGET_LAYER = 'TARGET_LAYER',
    COMPONENT_LAYER = 'COMPONENT_LAYER',
    ROUTE_LAYER = 'ROUTE_LAYER',
    POLYGON_LAYER = 'POLYGON_LAYER',
    CLOSED_AREA = 'CLOSED_AREA',
    DEFAULT = 'DEFAULT',
    PESAH_LAYER = "PESAH_LAYER"
}

