import {Coordinate, DrawableEntity} from '../map/models/map.model';

export interface ClosedAreaEntity extends DrawableEntity {
  id: string;
  coordinate:Coordinate;
  radius: number;
  type: ClosedAreaTypeEnum;
}

export enum ClosedAreaTypeEnum {
  Big = 'Big',
  Small = 'Small',
  Medium = 'Medium'
}
