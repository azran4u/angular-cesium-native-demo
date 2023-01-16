import {Injectable} from '@angular/core';
import {Cartesian3} from 'cesium';
import {Coordinate} from 'src/app/map.model';
import * as Cesium from 'cesium';

export class AreaService {
  static getCirclePolylineOutlinePositions(position: Coordinate, radius: number): Cartesian3[] {
    if (radius !== 0) {
      const ellipse = new Cesium.EllipseOutlineGeometry({
        center: Cesium.Cartesian3.fromDegrees(position.latitude, position.longitude),
        semiMajorAxis: radius,
        semiMinorAxis: radius
      })
      const points = Cesium.EllipseOutlineGeometry.createGeometry(ellipse)

      return Cesium.Cartesian3.unpackArray(points?.attributes.position.values as number[])
    }

    return []
  }
}