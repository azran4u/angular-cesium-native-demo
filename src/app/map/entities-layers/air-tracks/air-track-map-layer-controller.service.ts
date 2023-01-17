import {Injectable} from '@angular/core';
import * as Cesium from 'cesium';
import {MAP_LAYERS} from '../../models/map.model';
import {BaseMapLayerControllerService} from '../base-map-layer-controller.service';
import {coordinateToCesiumPosition} from '../../../../utils/coordinateToCesiumPosition';
import {MapService} from '../../services/map.service';
import {AirTrackEntity, AirTrackPropertyToDeriveColorFromEnum, JetType} from '../../../air-track/air-track.models';

@Injectable({
  providedIn: 'root',
})
export class AirTrackMapLayerControllerService extends BaseMapLayerControllerService<AirTrackEntity> {
  constructor(map: MapService) {
    super(map, MAP_LAYERS.AIR_TRACK_LAYER);
  }

  convertToCesiumEntity(entities: AirTrackEntity[]): Cesium.Entity[] {
    return entities.map(
      (entity) =>
        new Cesium.Entity({
          id: entity.id,
          properties: {
            layerType: this.layerType
          },
          position: coordinateToCesiumPosition(entity.coordinate),
          // polyline: {
          //   positions: getCirclePolylineOutlinePositions(entity.coordinate, entity.radius * 1000)
          // },
          // point: {
          //   color: Cesium.Color.GOLD,
          //   pixelSize: 10,
          //   scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0),
          // }
          billboard: {
            image: this.getPlaneTypeImage(entity.name), // default: undefined
            color: this.getPlaneColor(entity.someOtherPropertyToCalculateColor),
            scale: this.getScaleTypeImage(entity.name),
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0),
          },
        })
    );
  }

  propertiesToListenWhenChangeHappens(): (keyof AirTrackEntity)[] {
    return ['name', 'someOtherPropertyToCalculateColor', 'coordinate']
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

  private getPlaneColor(colorType: AirTrackPropertyToDeriveColorFromEnum): Cesium.Color {
    let color: Cesium.Color;
    switch (colorType) {
      case AirTrackPropertyToDeriveColorFromEnum.Hello :
        color = Cesium.Color.RED;
        break;
      case AirTrackPropertyToDeriveColorFromEnum.The :
        color = Cesium.Color.AQUA;
        break;
      case AirTrackPropertyToDeriveColorFromEnum.Other :
        color = Cesium.Color.MAGENTA;
        break;
      case AirTrackPropertyToDeriveColorFromEnum.Side :
        color = Cesium.Color.YELLOW;
        break;
      case AirTrackPropertyToDeriveColorFromEnum.Must :
        color = Cesium.Color.BLUE;
        break;
      case AirTrackPropertyToDeriveColorFromEnum.From :
        color = Cesium.Color.GOLD;
        break;
      case AirTrackPropertyToDeriveColorFromEnum.I :
        color = Cesium.Color.DEEPPINK;
        break;
      case AirTrackPropertyToDeriveColorFromEnum.Called :
        color = Cesium.Color.ORANGE;
        break;
      case AirTrackPropertyToDeriveColorFromEnum.Have :
        color = Cesium.Color.GRAY;
        break;
      case AirTrackPropertyToDeriveColorFromEnum.Thousand :
        color = Cesium.Color.PURPLE;
        break;
      case AirTrackPropertyToDeriveColorFromEnum.Times:
        color = Cesium.Color.DIMGRAY
        break;
      default :
        color = Cesium.Color.DARKSALMON;
    }
    return color;
  }
}
