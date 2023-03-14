import { SingleCoordinateDrawableEntity } from '../map/models/map.model';

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

export interface AirTrackEntity extends SingleCoordinateDrawableEntity {
  name: JetType;
  radius: number;
  from: string;
  to: string;
  firePower: number;
  someOtherPropertyToCalculateColor: AirTrackPropertyToDeriveColorFromEnum
}
