import { Injectable } from '@angular/core';
import * as Cesium from 'cesium';
import { ClosedAreaMapEntity, MAP_LAYERS } from '../../map.model';
import { MapLayerControllerService } from './map-layer-controller.service';
import { coordinateToCesiumPosition } from '../../../utils/coordinateToCesiumPosition';
import { MapService } from '../../map.service';
import { AreaService } from '../services/area.service';
import { randomAirTrackCoordinates } from 'src/utils/randomCoordinates';
import { v4 as uuidv4 } from 'uuid';


@Injectable({
  providedIn: 'root',
})
export class ClosedAreaMapLayerControllerService extends MapLayerControllerService<ClosedAreaMapEntity> {
  constructor(map: MapService, private areaService: AreaService) {
    super(map);
    this.setLayer(MAP_LAYERS.CLOSED_AREA);
  }
  convertToCesiumEntity(entities: ClosedAreaMapEntity[]): Cesium.Entity[] {
    return entities.map(
      (entity) =>
        new Cesium.Entity({
          id: entity.id,
          position: coordinateToCesiumPosition(entity.coordinate),
          polyline: {
            positions: this.areaService.getCirclePolylineOutlinePositions(entity.coordinate, 50000)
          },
        })
    );
  }

  
  createClosedAreas(amount: number): ClosedAreaMapEntity[] {
    const airplanes = randomAirTrackCoordinates(amount).map((coordinate) => {
      return {
        id: uuidv4(),
        coordinate,
      };
    });
    console.log(airplanes.map(a => a.id))
    return airplanes
  }
}
