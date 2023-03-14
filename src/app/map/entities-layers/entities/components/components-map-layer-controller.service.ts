import { Injectable } from '@angular/core';
import * as Cesium from 'cesium';

import {
  ICesiumBillboardOptions,
  ICesiumLabelOptions,
  ICesiumPointPrimitiveOptions,
} from 'src/app/map/models/cesium-interfaces';
import { MAP_LAYERS } from 'src/app/map/models/map.model';
import { MapService } from 'src/app/map/services/map.service';
import { ComponentEntity, TargetEntity } from 'src/app/targets/target.model';
import { coordinateToCesiumPosition } from 'src/utils/coordinateToCesiumPosition';
import { BaseMapLayerControllerService } from '../../base-map-layer-controller.service';
import { TargetsMapLayerControllerService } from '../targets/targets-map-layer-controller.service';

@Injectable({
  providedIn: 'root',
})
export class ComponentsMapLayerControllerService extends BaseMapLayerControllerService<ComponentEntity> {
  static COMOPNENT_DISTANCE_DISPLAY = 1e4;
  constructor(map: MapService) {
    super(map, MAP_LAYERS.COMPONENT_LAYER);
  }

  getCesiumElementForSingleEntity(element: ComponentEntity): {
    billboards?: ICesiumBillboardOptions[];
    points?: ICesiumPointPrimitiveOptions[];
    labels?: ICesiumLabelOptions[];
    entity?: Cesium.Entity;
  } {
          const billboards: ICesiumBillboardOptions[] = [];
          billboards.push({
            id: { id: element.id, layerType: this.layerType },
            image: this.getComponentImage(),
            color: Cesium.Color.YELLOW,
            scale: 0.1,
            position: coordinateToCesiumPosition(element.coordinate),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0,
              TargetsMapLayerControllerService.COMOPNENT_DISTANCE_DISPLAY
            ),
          });
    
          const entity = new Cesium.Entity({
            id: element.id,
            properties: {
              layerType: this.layerType,
            },
            position: coordinateToCesiumPosition(element.coordinate),
            polygon: {
              hierarchy: {
                positions: element.boundryPolygon.map(coordinateToCesiumPosition),
                holes: [],
              },
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                0,
                TargetsMapLayerControllerService.COMOPNENT_DISTANCE_DISPLAY
              ),
            },
          });
          return { entity, billboards };
  }

  propertiesToListenWhenChangeHappens(): (keyof ComponentEntity)[] {
    return [];
  }

  private getComponentImage() {
    return '../assets/component.png';
  }
}
