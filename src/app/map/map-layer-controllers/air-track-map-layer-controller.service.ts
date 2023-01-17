import {Injectable} from '@angular/core';
import * as Cesium from 'cesium';
import {AirTrackMapEntity, ColorEnum, JetType, MAP_LAYERS} from '../../map.model';
import {MapLayerControllerService} from './map-layer-controller.service';
import {coordinateToCesiumPosition} from '../../../utils/coordinateToCesiumPosition';
import {MapService} from '../../map.service';

@Injectable({
  providedIn: 'root',
})
export class AirTrackMapLayerControllerService extends MapLayerControllerService<AirTrackMapEntity> {
  constructor(map: MapService) {
    super(map, MAP_LAYERS.AIR_TRACK_LAYER);
  }

  convertToCesiumEntity(entities: AirTrackMapEntity[]): Cesium.Entity[] {
    return entities.map(
      (entity) =>
        new Cesium.Entity({
          id: entity.id,
          properties: {
            layerType: this.layerType
          },
          position: coordinateToCesiumPosition(entity.coordinate),
          // polyline: {
          //   positions: AreaService.getCirclePolylineOutlinePositions(entity.coordinate, entity.radius * 1000)
          // },
          // point: {
          //   color: Cesium.Color.GOLD,
          //   pixelSize: 10,
          //   scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0),
          // }
          billboard: {
            image: this.getPlaneTypeImage(entity.name), // default: undefined
            color: this.getPlaneColor(entity.color),
            scale: this.getScaleTypeImage(entity.name),
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0),
          },
        })
    );
  }

  propertiesToListenWhenChangeHappens(): (keyof AirTrackMapEntity)[] {
    return ['name', 'color', 'visible', 'coordinate']
  }

  private getPlaneTypeImage(name: JetType): string {
    let img;
    switch (name) {
      case JetType.heli:
        img = '../assets/heli.png';
        break;
      case JetType.fighter:
        img = '../assets/fighter-jet.png';
        break;
      case JetType.katbam:
        img = '../assets/drone.png';
        break;
    }
    return img;
  }

  private getScaleTypeImage(name: JetType): number {
    let scale;
    switch (name) {
      case JetType.heli:
        scale = 0.05;
        break;
      case JetType.fighter:
        scale = 0.1;
        break;
      case JetType.katbam:
        scale = 0.01;
        break;
    }
    return scale;
  }

  private getPlaneColor(colorType: ColorEnum): Cesium.Color {
    let color: Cesium.Color;
    switch (colorType) {
      case ColorEnum.RED :
        color = Cesium.Color.RED;
        break;
      case ColorEnum.AQUA :
        color = Cesium.Color.AQUA;
        break;
      case ColorEnum.MAGENTA :
        color = Cesium.Color.MAGENTA;
        break;
      case ColorEnum.YELLOW :
        color = Cesium.Color.YELLOW;
        break;
      case ColorEnum.BLUE :
        color = Cesium.Color.BLUE;
        break;
      case ColorEnum.GOLD :
        color = Cesium.Color.GOLD;
        break;
      case ColorEnum.DEEPPINK :
        color = Cesium.Color.DEEPPINK;
        break;
      case ColorEnum.ORANGE :
        color = Cesium.Color.ORANGE;
        break;
      case ColorEnum.GRAY :
        color = Cesium.Color.GRAY;
        break;
      case ColorEnum.PURPLE :
        color = Cesium.Color.PURPLE;
        break;
    }
    return color;

  }
}
