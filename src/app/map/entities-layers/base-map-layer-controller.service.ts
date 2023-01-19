import {Injectable} from '@angular/core';
import * as Cesium from 'cesium';
import {DrawableEntity, MAP_LAYERS} from '../models/map.model';
import {MapService} from '../services/map.service';
import {take} from 'rxjs';
import {ICesiumBillboardOptions, ICesiumLabelOptions, ICesiumPointPrimitiveOptions} from '../models/cesium-interfaces';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseMapLayerControllerService<T extends DrawableEntity> {
  smallAmountOfUpdatedEntities = 20;
  private readonly layer: MAP_LAYERS = MAP_LAYERS.DEFAULT;
  protected entities: Cesium.Entity[] = [];
  protected primitives: {
    billboardsCollection: Cesium.BillboardCollection | undefined;
    pointsCollection: Cesium.PointPrimitiveCollection | undefined;
    labelsCollection: Cesium.LabelCollection | undefined;
  }

  private elementsRecord: Map<string, { billboards: Cesium.Billboard[]; points: Cesium.PointPrimitive[]; labels: Cesium.Label[] }> = new Map<string, { billboards: Cesium.Billboard[]; points: Cesium.PointPrimitive[]; labels: Cesium.Label[] }>();

  protected constructor(private mapService: MapService, layer: MAP_LAYERS = MAP_LAYERS.DEFAULT) {
    this.layer = layer;
    this.mapService.viewerReady$.pipe(take(1)).subscribe(() => {
      this.createLayer().then();
    })
    this.primitives = {
      billboardsCollection: new Cesium.BillboardCollection(),
      pointsCollection: new Cesium.PointPrimitiveCollection(),
      labelsCollection: new Cesium.LabelCollection(),
    }
  }

  async createLayer(): Promise<void> {
    await this.mapService.createLayer(this.layer);
  }

  get layerType(): MAP_LAYERS {
    return this.layer
  }

  upsertEntities(entities: T[]): void {
    this.renderCurrentEntitiesOnMap(entities);
    this.showLayer();
  }

  drawElementsOnMapAndDeletePreviousDrawnObjects2(elements: T[]): void {
    if (this.primitives.billboardsCollection?.length && !this.primitives.billboardsCollection.isDestroyed() ) {
      if(this.mapService.removeCollection(this.primitives.billboardsCollection)) {
        !this.primitives.billboardsCollection.isDestroyed() && this.primitives.billboardsCollection.destroy();
        this.primitives.billboardsCollection = undefined;
      }
    }
    if (this.primitives.pointsCollection?.length) {
      this.mapService.removeCollection(this.primitives.pointsCollection);
      !this.primitives.pointsCollection.isDestroyed() && this.primitives.pointsCollection.destroy();
      this.primitives.pointsCollection = undefined;
    }
    if (this.primitives.labelsCollection?.length) {
      this.mapService.removeCollection(this.primitives.labelsCollection);
      !this.primitives.labelsCollection.isDestroyed() && this.primitives.labelsCollection.destroy();
      this.primitives.labelsCollection = undefined;
    }
    if (this.entities?.length) {
      this.mapService.removeEntities(this.layerType);
      this.entities = [];
    }
    this.clearEntitiesRecord();
    const billboardsCollection = new Cesium.BillboardCollection();
    const labelsCollection = new Cesium.LabelCollection();
    const pointsCollection = new Cesium.PointPrimitiveCollection();
    const entities: Cesium.Entity[] = [];
    for (const element of elements) {
      const {billboards, points, labels, entity} = this.getCesiumElementForSingleEntity(element);
      const cesiumBillboards: Cesium.Billboard[] = []
      const cesiumLabels: Cesium.Label[] = []
      const cesiumPoints: Cesium.PointPrimitive[] = []
      billboards?.forEach(billboard => {
        cesiumBillboards.push(billboardsCollection.add(billboard));
      })
      labels?.forEach(label => {
        cesiumLabels.push(labelsCollection.add(label));
      })
      points?.forEach(point => {
        cesiumPoints.push(pointsCollection.add(point));
      })
      if (entity) {
        entities.push(entity);
      }
      this.recordEntityFromScratch(element.id, cesiumBillboards, cesiumPoints, cesiumLabels);
    }
    this.primitives = {
      billboardsCollection,
      pointsCollection,
      labelsCollection
    };
    this.entities = entities ?? [];
    this.mapService.upsertPrimitives({
      billboards: billboardsCollection,
      points: pointsCollection,
      labels: labelsCollection
    });
    this.mapService.addEntities(this.layerType, entities ?? []);
  }

  // TODO: i have a problem when it is automatically updating and i try to add more elements to the array
  upsertAndDeleteElementsOnMap(added: T[], updated: T[], deletedIds: string[]): void {
    // not gonna destroy the already existing collections!

    // ADD
    const billboardsCollection = this.primitives.billboardsCollection ?? new Cesium.BillboardCollection();
    const labelsCollection = this.primitives.labelsCollection ?? new Cesium.LabelCollection();
    const pointsCollection = this.primitives.pointsCollection ?? new Cesium.PointPrimitiveCollection();
    const entities: Cesium.Entity[] = [];
    for (const element of added) {
      const {billboards, points, labels, entity} = this.getCesiumElementForSingleEntity(element);
      const cesiumBillboards: Cesium.Billboard[] = []
      const cesiumLabels: Cesium.Label[] = []
      const cesiumPoints: Cesium.PointPrimitive[] = []
      billboards?.forEach(billboard => {
        cesiumBillboards.push(billboardsCollection.add(billboard));
      })
      labels?.forEach(label => {
        cesiumLabels.push(labelsCollection.add(label));
      })
      points?.forEach(point => {
        cesiumPoints.push(pointsCollection.add(point));
      })
      if (entity) {
        entities.push(entity);
      }
      this.recordEntityFromScratch(element.id, cesiumBillboards, cesiumPoints, cesiumLabels);
    }
    this.primitives = {
      ...this.primitives,
      billboardsCollection,
      pointsCollection,
      labelsCollection
    }
    this.mapService.upsertPrimitives({labels: labelsCollection, points: pointsCollection,billboards: billboardsCollection});

    // UPDATE
    const updatedEntities: Cesium.Entity[] = []
    for (const element of updated) {
      const prevCesiumElementsObject = this.elementsRecord.get(element.id);
      prevCesiumElementsObject?.labels?.forEach((label) => {
        this.primitives.labelsCollection?.remove(label);
      })
      prevCesiumElementsObject?.points?.forEach((label) => {
        this.primitives.pointsCollection?.remove(label);
      })
      prevCesiumElementsObject?.billboards?.forEach((billboard) => {
        this.primitives.billboardsCollection?.remove(billboard);
      })
      const {billboards, points, labels, entity} = this.getCesiumElementForSingleEntity(element);
      const cesiumBillboards: Cesium.Billboard[] = []
      const cesiumLabels: Cesium.Label[] = []
      const cesiumPoints: Cesium.PointPrimitive[] = []
      billboards?.forEach(billboard => {
        cesiumBillboards.push(billboardsCollection.add(billboard));
      })
      labels?.forEach(label => {
        cesiumLabels.push(labelsCollection.add(label));
      })
      points?.forEach(point => {
        cesiumPoints.push(pointsCollection.add(point));
      })
      if (entity) {
        updatedEntities.push(entity);
      }
      this.recordEntityFromScratch(element.id, cesiumBillboards, cesiumPoints, cesiumLabels);
    }

    this.mapService.upsertEntitiesToLayer(this.layerType, [...(entities ?? []), ...(updatedEntities ?? [])], false)

    // DELETE
    for (const deletedId of deletedIds) {
      const prevCesiumElementsObject = this.elementsRecord.get(deletedId);
      prevCesiumElementsObject?.points?.forEach((label) => {
        this.primitives.pointsCollection?.remove(label);
      })
      prevCesiumElementsObject?.labels?.forEach((label) => {
        this.primitives.labelsCollection?.remove(label);
      })
      prevCesiumElementsObject?.billboards?.forEach((billboard) => {
        this.primitives.billboardsCollection?.remove(billboard);
      })
    }
    this.deleteEntitiesFromRecord(deletedIds);
    this.mapService.removeEntitiesOfLayerByIds(this.layerType, deletedIds);
  }

  renderCurrentEntitiesOnMap(entities: T[]): void {
    this.mapService.upsertEntitiesToLayer(
      this.layer,
      this.convertToCesiumEntity(entities),
      true
    );
  }

  removeAllEntitiesFromLayer(): void {
    this.mapService.upsertEntitiesToLayer(
      this.layer,
      [],
      true
    );
  }

  drawPrimitives(primitives: { billboardsCollection: Cesium.BillboardCollection }): void {
    // this.mapService.upsertPrimitives(primitives);
  }

  hideLayer(): void {
    this.mapService.hideLayer(this.layer);
  }

  showLayer(): void {
    this.mapService.showLayer(this.layer);
  }

  async focusOnEntities(): Promise<void> {
    const entitiesToFocusOn = this.mapService.getEntities(this.layer);
    await this.mapService.flyTo(entitiesToFocusOn);
  }

  async flyToEntity(id: string): Promise<void> {
    await this.mapService.flyTo(this.mapService.getEntityById(id, this.layer) ?? []);
  }

  private recordEntityFromScratch(id: string, billboards: Cesium.Billboard[], points: Cesium.PointPrimitive[], labels: Cesium.Label[]): void {
    // this.elementsRecord.clear();
    this.elementsRecord.set(id, {billboards, labels, points});
  }

  private deleteEntitiesFromRecord(ids: string[]): void {
    ids.forEach(id => {
      this.elementsRecord.delete(id);
    })
  }

  private clearEntitiesRecord(): void {
    this.elementsRecord.clear();
  }

  private upsertDeleteEntitiesFromRecord(elementsUpserted: (Cesium.Billboard | Cesium.PointPrimitive | Cesium.Label)[],
                                         deletedIds: string[]): void {
    deletedIds.forEach(id => this.elementsRecord.delete(id));
    for (const element of elementsUpserted) {
      // this.elementsRecord.set(element.id.id, element);
    }
  }

  abstract convertToCesiumEntity(entities: T[]): Cesium.Entity[];

  abstract propertiesToListenWhenChangeHappens(): (keyof T)[];

  abstract convertToCesiumPrimitivesCollections(entities: T[]): { billboardsCollection: Cesium.BillboardCollection }

  abstract getCesiumCollectionsFromElements(elements: T[]): {
    billboards?: ICesiumBillboardOptions[];
    points?: ICesiumPointPrimitiveOptions[];
    labels?: ICesiumLabelOptions[];
    entities?: Cesium.Entity[];
  }

  abstract getCesiumElementForSingleEntity(element: T): {
    billboards?: ICesiumBillboardOptions[];
    points?: ICesiumPointPrimitiveOptions[];
    labels?: ICesiumLabelOptions[];
    entity?: Cesium.Entity;
  }
}
