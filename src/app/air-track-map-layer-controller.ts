import { Injectable } from '@angular/core';
import * as Cesium from 'cesium';
import { AirTrackMapEntity, MAP_LAYERS } from './map.model';
import { MapLayerControllerService } from './map-layer-controller.service';
import { coordinateToCesiumPosition } from '../utils/coordinateToCesiumPosition';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class AirTrackMapLayerControllerService extends MapLayerControllerService<AirTrackMapEntity> {
  constructor(map: MapService) {
    super(map);
    this.setLayer(MAP_LAYERS.AIR_TRACK_LAYER);
  }
  convertToCesiumEntity(entities: AirTrackMapEntity[]): Cesium.Entity[] {
    return entities.map(
      (entity) =>
        new Cesium.Entity({
          id: entity.id,
          position: coordinateToCesiumPosition(entity.coordinate),
          billboard: {
            image: '../assets/fighter-jet.png', // default: undefined
            color: Cesium.Color.RED,
            scale: 0.1,
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0),
          },
        })
    );
  }
}
