import {Coordinate, DrawableEntity} from '../map/models/map.model';

export enum AirTrackPropertyToDeriveColorFromEnum {
  Hello, From, The, Other,
  Side, I, Must, Have, Called,
  Thousand, Times
}


export enum JetType {
  fighter,
  heli,
  katbam
}

export interface AirTrackEntity extends DrawableEntity{
  id: string;
  coordinate: Coordinate;
  name: JetType;
  radius: number;
  from: string;
  to: string;
  firePower: number;
  someOtherPropertyToCalculateColor: AirTrackPropertyToDeriveColorFromEnum
}
