import {Injectable} from '@angular/core';
import * as Cesium from 'cesium';
import {ClosedAreaMapEntity, MAP_LAYERS} from '../../map.model';
import {MapLayerControllerService} from './map-layer-controller.service';
import {coordinateToCesiumPosition} from '../../../utils/coordinateToCesiumPosition';
import {MapService} from '../../map.service';
import {AreaService} from '../services/area.service';


@Injectable({
  providedIn: 'root',
})
export class ClosedAreaMapLayerControllerService extends MapLayerControllerService<ClosedAreaMapEntity> {
  constructor(map: MapService) {
    super(map, MAP_LAYERS.CLOSED_AREA);
  }

  convertToCesiumEntity(entities: ClosedAreaMapEntity[]): Cesium.Entity[] {
    return entities.map(
      (entity) =>
        new Cesium.Entity({
          id: entity.id,
          position: coordinateToCesiumPosition(entity.coordinate),
          properties: {
            layerType: this.layerType
          },
          polyline: {
            positions: AreaService.getCirclePolylineOutlinePositions(entity.coordinate, 50000)
          },
        })
    );
  }

  override propertiesToListenWhenChangeHappens(): (keyof ClosedAreaMapEntity)[] {
    return ['coordinate', 'visible'];
  }
}
