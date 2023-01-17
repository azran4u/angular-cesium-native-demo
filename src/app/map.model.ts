export interface Coordinate {
  longitude: number;
  latitude: number;
  height?: number;
}

export type MapEntityId = string;

export interface MapEntity {
  id: MapEntityId;
  coordinate: Coordinate;
  visible: boolean;
  label?: string;
}

export enum ColorEnum {
  RED, GOLD, AQUA,MAGENTA,
  YELLOW, DEEPPINK ,BLUE,GRAY, ORANGE,
  PURPLE
}

export enum JetType {
  fighter,
  heli,
  katbam
}
export interface AirTrackMapEntity extends MapEntity {
  name: JetType;
  color:ColorEnum;
  radius: number;
  from: string;
  to: string;
  firePower: number;
}

export interface ClosedAreaMapEntity extends MapEntity {}

export enum MAP_LAYERS {
  AIR_TRACK_LAYER = 'AIR_TRACK_LAYER',
  POLYGON_LAYER = 'POLYGON_LAYER',
  CLOSED_AREA = 'CLOSED_AREA',
  DEFAULT = 'DEFAULT',
}
