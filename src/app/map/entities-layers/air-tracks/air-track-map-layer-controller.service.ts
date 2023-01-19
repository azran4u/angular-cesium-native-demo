import {Injectable} from '@angular/core';
import * as Cesium from 'cesium';
import {MAP_LAYERS} from '../../models/map.model';
import {BaseMapLayerControllerService} from '../base-map-layer-controller.service';
import {coordinateToCesiumPosition} from '../../../../utils/coordinateToCesiumPosition';
import {MapService} from '../../services/map.service';
import {AirTrackEntity, AirTrackPropertyToDeriveColorFromEnum, JetType} from '../../../air-track/air-track.models';
import {getCirclePolylineOutlinePositions} from '../../utils/circle-polyline-outline-positions.function';
import {
  ICesiumBillboardOptions,
  ICesiumLabelOptions,
  ICesiumPointPrimitiveOptions
} from '../../models/cesium-interfaces';

@Injectable({
  providedIn: 'root',
})
export class AirTrackMapLayerControllerService extends BaseMapLayerControllerService<AirTrackEntity> {
  constructor(map: MapService) {
    super(map, MAP_LAYERS.AIR_TRACK_LAYER);
  }

  getCesiumElementForSingleEntity(element: AirTrackEntity): {
    billboards?: ICesiumBillboardOptions[];
    points?: ICesiumPointPrimitiveOptions[];
    labels?: ICesiumLabelOptions[];
    entity?: Cesium.Entity;
  } {
    const billboards: ICesiumBillboardOptions[] = [];
    billboards.push({
      id: {id: element.id, layerType: this.layerType},
      image: this.getPlaneTypeImage(element.name), // default: undefined
      color: this.getPlaneColor(element.someOtherPropertyToCalculateColor),
      scale: this.getScaleTypeImage(element.name),
      position: coordinateToCesiumPosition(element.coordinate),
    });
    billboards.push({
      id: {id: element.id, layerType: this.layerType},
      position: coordinateToCesiumPosition({
        latitude: element.coordinate.latitude + 0.03,
        longitude: element.coordinate.longitude + 0.03
      }),
      image: this.getPlaneTypeImage(element.name), // default: undefined
      color: Cesium.Color.DEEPSKYBLUE,
      scale: this.getScaleTypeImage(element.name),
    });
    const entity = new Cesium.Entity({
      id: element.id,
      properties: {
        layerType: this.layerType
      },
      position: coordinateToCesiumPosition(element.coordinate),
      polyline: {
        positions: getCirclePolylineOutlinePositions(element.coordinate, element.radius * 1000)
      },
    })
    return {entity, billboards};
  }

  getCesiumCollectionsFromElements(elements: AirTrackEntity[]): {
    billboards?: ICesiumBillboardOptions[];
    points?: ICesiumPointPrimitiveOptions[];
    labels?: ICesiumLabelOptions[];
    entities?: Cesium.Entity[];
  } {
    const entities: Cesium.Entity[] = []
    const billboards: ICesiumBillboardOptions[] = [];
    for (const element of elements) {
      billboards.push({
        id: {id: element.id, layerType: this.layerType},
        image: this.getPlaneTypeImage(element.name), // default: undefined
        color: this.getPlaneColor(element.someOtherPropertyToCalculateColor),
        scale: this.getScaleTypeImage(element.name),
        position: coordinateToCesiumPosition(element.coordinate),
      });
      billboards.push({
        id: {id: element.id, layerType: this.layerType},
        position: coordinateToCesiumPosition({
          latitude: element.coordinate.latitude + 0.03,
          longitude: element.coordinate.longitude + 0.03
        }),
        image: this.getPlaneTypeImage(element.name), // default: undefined
        color: Cesium.Color.DEEPSKYBLUE,
        scale: this.getScaleTypeImage(element.name),
      });
      entities.push(new Cesium.Entity({
        id: element.id,
        properties: {
          layerType: this.layerType
        },
        position: coordinateToCesiumPosition(element.coordinate),
        polyline: {
          positions: getCirclePolylineOutlinePositions(element.coordinate, element.radius * 1000)
        },
      }))
    }

    return {billboards, entities}
  }


  convertToCesiumPrimitivesCollections(entities: AirTrackEntity[]): { billboardsCollection: Cesium.BillboardCollection } {
    const billboardsCollection = new Cesium.BillboardCollection();
    let i = 0
    for (const entity of entities) {
      i++;
      billboardsCollection.add({
        id: {id: entity.id, layerType: this.layerType},
        image: this.getPlaneTypeImage(entity.name), // default: undefined
        color: this.getPlaneColor(entity.someOtherPropertyToCalculateColor),
        scale: this.getScaleTypeImage(entity.name),
        // scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0),
        position: coordinateToCesiumPosition(entity.coordinate),
      });
      billboardsCollection.add({
        id: {id: entity.id, layerType: this.layerType},
        position: coordinateToCesiumPosition({
          latitude: entity.coordinate.latitude + 0.03,
          longitude: entity.coordinate.longitude + 0.03
        }),
        image: this.getPlaneTypeImage(entity.name), // default: undefined
        color: Cesium.Color.DEEPSKYBLUE,
        scale: this.getScaleTypeImage(entity.name),
        // scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0),
      })
    }

    return {billboardsCollection};
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
    return  ['name', 'someOtherPropertyToCalculateColor', 'coordinate','firePower']
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
