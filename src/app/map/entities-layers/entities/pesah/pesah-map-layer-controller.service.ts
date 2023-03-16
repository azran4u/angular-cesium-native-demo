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
import { getCirclePolylineOutlinePositions } from 'src/app/map/utils/circle-polyline-outline-positions.function';
import { PesahEntity } from 'src/app/pesah/pesah.model';
import { coordinateToCesiumPosition } from 'src/utils/coordinateToCesiumPosition';
import { BaseMapLayerControllerService } from '../../base-map-layer-controller.service';

@Injectable({
  providedIn: 'root',
})
export class PesahMapLayerControllerService extends BaseMapLayerControllerService<PesahEntity> {
  constructor(map: MapService) {
    super(map, MAP_LAYERS.PESAH_LAYER);
  }

  getCesiumElementForSingleEntity(element: PesahEntity): {
    billboards?: ICesiumBillboardOptions[];
    points?: ICesiumPointPrimitiveOptions[];
    labels?: ICesiumLabelOptions[];
    entity?: Cesium.Entity;
  } {
    const labels: ICesiumLabelOptions[] = [];
    const billboards: ICesiumBillboardOptions[] = [];

    labels.push({
      id: { id: Math.random().toString(), layerType: MAP_LAYERS.ROUTE_LAYER },
      text: element.name ?? 'NO NAME',
      position: coordinateToCesiumPosition(element.coordinate),
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      pixelOffset: new Cesium.Cartesian2(0, -20),
    });
    billboards.push({
      id: { id: Math.random().toString(), layerType: MAP_LAYERS.PESAH_LAYER },
      image: this.getPointImage(),
      position: coordinateToCesiumPosition(element.coordinate),
      scale: 0.1,
    });

    const positions = getCirclePolylineOutlinePositions(
      element.coordinate,
      element.radius
    );

    const entity = new Cesium.Entity({
      id: element.id,
      position: coordinateToCesiumPosition(element.coordinate),
      properties: {
        layerType: this.layerType,
      },
      polyline: {
        positions,
        material: new Cesium.PolylineDashMaterialProperty({
          color: this.getPolylineColor(element),
          gapColor: Cesium.Color.BLACK,
        }),
      },
      polygon: {
        hierarchy: {
          positions,
          holes: [
            {
              positions: getCirclePolylineOutlinePositions(
                element.coordinate,
                element.radius - element.radius * 0.15
              ),
              holes: [],
            },
          ],
        },
        material: Cesium.Color.RED.withAlpha(0.2),
      },
    });
    return { entity, billboards, labels };
  }

  propertiesToListenWhenChangeHappens(): (keyof PesahEntity)[] {
    return ['coordinate'];
  }

  getPolylineColor(element: PesahEntity): Cesium.Color {
    return Cesium.Color.fromCssColorString(element.color);
  }

  private getPointImage() {
    return '../assets/white-dot.png';
  }
}
