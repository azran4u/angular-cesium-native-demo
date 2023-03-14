import { Injectable } from '@angular/core';
import * as Cesium from 'cesium';
import {
  ICesiumBillboardOptions,
  ICesiumLabelOptions,
  ICesiumPointPrimitiveOptions,
} from 'src/app/map/models/cesium-interfaces';
import { MAP_LAYERS } from 'src/app/map/models/map.model';
import { MapService } from 'src/app/map/services/map.service';
import { TargetEntity } from 'src/app/targets/target.model';
import { coordinateToCesiumPosition } from 'src/utils/coordinateToCesiumPosition';
import { BaseMapLayerControllerService } from '../../base-map-layer-controller.service';

@Injectable({
  providedIn: 'root',
})
export class TargetsMapLayerControllerService extends BaseMapLayerControllerService<TargetEntity> {
  static COMOPNENT_DISTANCE_DISPLAY = 1e4;
  constructor(map: MapService) {
    super(map, MAP_LAYERS.TARGET_LAYER);
  }

  getCesiumElementForSingleEntity(element: TargetEntity): {
    billboards?: ICesiumBillboardOptions[];
    points?: ICesiumPointPrimitiveOptions[];
    labels?: ICesiumLabelOptions[];
    entity?: Cesium.Entity;
  } {
    const billboards: ICesiumBillboardOptions[] = [];
    billboards.push({
      id: { id: element.id, layerType: this.layerType },
      image: this.getTargetImage(), // default: undefined
      scale: this.getScaleImage(),
      position: coordinateToCesiumPosition(element.coordinate),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        TargetsMapLayerControllerService.COMOPNENT_DISTANCE_DISPLAY
      ),
    });
    const entity = new Cesium.Entity({
      id: element.id,
      properties: {
        layerType: this.layerType,
      },
      position: coordinateToCesiumPosition(element.coordinate),
    });
    return { entity, billboards };
  }

  propertiesToListenWhenChangeHappens(): (keyof TargetEntity)[] {
    return ['coordinate'];
  }

  private getTargetImage() {
    return '../assets/target.png';
  }

  private getScaleImage() {
    return 0.05;
  }
}
