import { Coordinate, SingleCoordinateDrawableEntity } from '../map/models/map.model';

export interface TargetEntity extends SingleCoordinateDrawableEntity {
  components: Array<ComponentEntity>;
}

export interface ComponentEntity extends SingleCoordinateDrawableEntity {
  boundryPolygon: Array<Coordinate>;
}
