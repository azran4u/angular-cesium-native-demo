import * as Cesium from 'cesium';
import {Coordinate} from '../app/map/models/map.model';

export function coordinateToCesiumPosition(coordinate: Coordinate) {
  return new Cesium.ConstantPositionProperty(
    Cesium.Cartesian3.fromDegrees(coordinate.latitude, coordinate.longitude)
  );
}
