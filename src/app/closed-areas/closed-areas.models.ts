import { SingleCoordinateDrawableEntity} from '../map/models/map.model';

export interface ClosedAreaEntity extends SingleCoordinateDrawableEntity {
  radius: number;
  type: ClosedAreaTypeEnum;
}

export enum ClosedAreaTypeEnum {
  Big = 'Big',
  Small = 'Small',
  Medium = 'Medium'
}
