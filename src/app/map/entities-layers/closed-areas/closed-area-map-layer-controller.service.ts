import {Injectable} from '@angular/core';
import * as Cesium from 'cesium';
import {MAP_LAYERS} from '../../models/map.model';
import {BaseMapLayerControllerService} from '../base-map-layer-controller.service';
import {coordinateToCesiumPosition} from '../../../../utils/coordinateToCesiumPosition';
import {MapService} from '../../services/map.service';
import {ClosedAreaEntity, ClosedAreaTypeEnum} from '../../../closed-areas/closed-areas.models';
import {getCirclePolylineOutlinePositions} from '../../utils/circle-polyline-outline-positions.function';
import {BillboardCollection} from 'cesium';


@Injectable({
  providedIn: 'root',
})
export class ClosedAreaMapLayerControllerService extends BaseMapLayerControllerService<ClosedAreaEntity> {
  constructor(map: MapService) {
    super(map, MAP_LAYERS.CLOSED_AREA);
  }

  convertToCesiumEntity(entities: ClosedAreaEntity[]): Cesium.Entity[] {
    return entities.map(
      (entity) =>
        new Cesium.Entity({
          id: entity.id,
          position: coordinateToCesiumPosition(entity.coordinate),
          properties: {
            layerType: this.layerType
          },
          polyline: {
            positions: getCirclePolylineOutlinePositions(entity.coordinate, 50000),
            material: this.getPolylineColor(entity)
          },
          billboard: {
            image: '../assets/heli.png', // default: undefined
            color: Cesium.Color.DEEPSKYBLUE,
            scale: 0.05
          }
        })
    );
  }

  override propertiesToListenWhenChangeHappens(): (keyof ClosedAreaEntity)[] {
    return [] //['coordinate'];
  }

  private getPolylineColor(entity: ClosedAreaEntity): Cesium.Color {
    let color: Cesium.Color;
    switch (entity.type) {
      case ClosedAreaTypeEnum.Big:
        color = Cesium.Color.MAGENTA;
        break;
      case ClosedAreaTypeEnum.Medium:
        color = Cesium.Color.CRIMSON;
        break;
      case ClosedAreaTypeEnum.Small:
        color = Cesium.Color.ORANGE;
        break;
      default:
        color = Cesium.Color.BROWN;
    }

    return color;
  }

  convertToCesiumPrimitivesCollections(entities: ClosedAreaEntity[]): { billboardsCollection: Cesium.BillboardCollection } {
    return {billboardsCollection: new Cesium.BillboardCollection()};
  }

  getCesiumCollectionsFromElements(elements: ClosedAreaEntity[]): {
    billboards?: Cesium.BillboardCollection;
    points?: Cesium.PointPrimitiveCollection;
    labels?: Cesium.LabelCollection;
    entities?: Cesium.Entity[];
  } {
    const billboardCollection = new BillboardCollection();
    const entities = []
    for (const element of elements) {
      entities.push(new Cesium.Entity({
        id: element.id,
        position: coordinateToCesiumPosition(element.coordinate),
        properties: {
          layerType: this.layerType
        },
        polyline: {
          positions: getCirclePolylineOutlinePositions(element.coordinate, 50000),
          material: this.getPolylineColor(element)
        },
        billboard: {
          image: '../assets/heli.png', // default: undefined
          color: Cesium.Color.DEEPSKYBLUE,
          scale: 0.05
        }
      }))
    }

    return {billboards: billboardCollection, entities}
  }
}