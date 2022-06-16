import { Coordinate } from '../app/map.model';
import * as Cesium from 'cesium';

export function coordinateToCesiumPosition(coordinate: Coordinate) {
  return new Cesium.ConstantPositionProperty(
    Cesium.Cartesian3.fromDegrees(coordinate.latitude, coordinate.longitude)
  );
}
