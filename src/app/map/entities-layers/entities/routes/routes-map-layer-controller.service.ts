import { Injectable } from '@angular/core';
import * as Cesium from 'cesium';
import { orderBy } from 'lodash';
import {
  ICesiumBillboardOptions,
  ICesiumLabelOptions,
  ICesiumPointPrimitiveOptions,
} from 'src/app/map/models/cesium-interfaces';
import { Coordinate, MAP_LAYERS } from 'src/app/map/models/map.model';
import { MapService } from 'src/app/map/services/map.service';
import { RouteEntity } from 'src/app/route/route.model';
import { coordinateToCesiumPosition } from 'src/utils/coordinateToCesiumPosition';
import { BaseMapLayerControllerService } from '../../base-map-layer-controller.service';

@Injectable({
  providedIn: 'root',
})
export class RoutesMapLayerControllerService extends BaseMapLayerControllerService<RouteEntity> {
  constructor(map: MapService) {
    super(map, MAP_LAYERS.ROUTE_LAYER);
  }

  getCesiumElementForSingleEntity(element: RouteEntity): {
    billboards?: ICesiumBillboardOptions[];
    points?: ICesiumPointPrimitiveOptions[];
    labels?: ICesiumLabelOptions[];
    entity?: Cesium.Entity;
  } {
    const sortedCoordinates = orderBy(
      element.coordinates,
      (c) => c.name && element.serialNumbers[c.name]
    );
    const labels: ICesiumLabelOptions[] = [];
    const billboards: ICesiumBillboardOptions[] = [];
    for (const coordinate of element.coordinates) {
      labels.push({
        id: { id: Math.random().toString(), layerType: MAP_LAYERS.ROUTE_LAYER },
        text: coordinate.name ?? 'NO NAME',
        position: coordinateToCesiumPosition(coordinate),
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        pixelOffset: new Cesium.Cartesian2(0, -25)
      });
      billboards.push({
        id: { id: Math.random().toString(), layerType: MAP_LAYERS.ROUTE_LAYER },
        image: this.getPointImage(),
        position: coordinateToCesiumPosition(coordinate),
        scale: 0.1,
      });
    }
    const entity = new Cesium.Entity({
      id: element.id,
      properties: {
        layerType: this.layerType,
      },
      corridor: {
        positions: sortedCoordinates.map(coordinateToCesiumPosition),
        width: 400,
        cornerType: Cesium.CornerType.MITERED,
        material: Cesium.Color.LIGHTPINK,
      },
      polyline: {
          positions: sortedCoordinates.map(coordinateToCesiumPosition),
      }
    });
    return { entity, billboards, labels };
  }

  propertiesToListenWhenChangeHappens(): (keyof RouteEntity)[] {
    return ['coordinates', 'serialNumbers'];
  }

  private getPointImage() {
    return '../assets/white-dot.png';
  }
}
