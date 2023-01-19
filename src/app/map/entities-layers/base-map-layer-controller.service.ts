import {Injectable} from '@angular/core';
import * as Cesium from 'cesium';
import {DrawableEntity, MAP_LAYERS} from '../models/map.model';
import {MapService} from '../services/map.service';
import {take} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseMapLayerControllerService<T extends DrawableEntity> {
  private readonly layer: MAP_LAYERS = MAP_LAYERS.DEFAULT;
  protected entities: Cesium.Entity[] = [];
  protected primitives: {
    billboardsCollection: Cesium.BillboardCollection | undefined;
    pointsCollection: Cesium.PointPrimitiveCollection | undefined;
    labelsCollection: Cesium.LabelCollection | undefined;
  }

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

  drawElementsOnMap(elements: T[]): void {
    const {billboards, points, labels, entities} = this.getCesiumCollectionsFromElements(elements);
    if (billboards) {
      if (this.primitives.billboardsCollection?.length) {
        this.mapService.removeCollection(this.primitives.billboardsCollection);
        !this.primitives.billboardsCollection.isDestroyed() && this.primitives.billboardsCollection.destroy();
      }
    }
    if (points) {
      if (this.primitives.pointsCollection?.length) {
        this.mapService.removeCollection(this.primitives.pointsCollection);
        !this.primitives.pointsCollection.isDestroyed() && this.primitives.pointsCollection.destroy();
      }
    }
    if (labels) {
      if (this.primitives.labelsCollection?.length) {
        this.mapService.removeCollection(this.primitives.labelsCollection);
        !this.primitives.labelsCollection.isDestroyed() && this.primitives.labelsCollection.destroy();
      }
    }
    if (entities) {
      if (this.entities?.length) {
        this.mapService.removeEntities(this.layerType);
        this.entities = [];
      }
    }

    this.primitives = {
      ...this.primitives,
      billboardsCollection: billboards,
      pointsCollection: points,
      labelsCollection: labels
    };
    this.entities = entities ?? [];
    this.mapService.upsertPrimitives({billboards, points, labels});
    this.mapService.addEntities(this.layerType, entities ?? []);
  }

  upsertAndDeletePrimitives(billboardsCollection: Cesium.BillboardCollection): void {
    if (this.primitives.billboardsCollection?.length) {
      this.mapService.removeCollection(this.primitives.billboardsCollection);
      !this.primitives.billboardsCollection.isDestroyed() && this.primitives.billboardsCollection.destroy();
    }
    this.primitives = {
      ...this.primitives,
      billboardsCollection
    };
    // this.mapService.upsertPrimitives({billboardsCollection});
  }

  upsertAndDeleteEntities(entitiesToUpsert: T[], entitiesToDelete: T[]): void {
    this.mapService.upsertEntitiesToLayer(
      this.layer,
      this.convertToCesiumEntity(entitiesToUpsert),
      this.convertToCesiumEntity(entitiesToDelete)
    );
  }

  renderCurrentEntitiesOnMap(entities: T[]): void {
    this.mapService.upsertEntitiesToLayer(
      this.layer,
      this.convertToCesiumEntity(entities),
      []
    );
  }

  removeAllEntitiesFromLayer(): void {
    this.mapService.upsertEntitiesToLayer(
      this.layer,
      [],
      this.mapService.getEntities(this.layer)
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

  abstract convertToCesiumEntity(entities: T[]): Cesium.Entity[];

  abstract propertiesToListenWhenChangeHappens(): (keyof T)[];

  abstract convertToCesiumPrimitivesCollections(entities: T[]): { billboardsCollection: Cesium.BillboardCollection }

  abstract getCesiumCollectionsFromElements(elements: T[]): {
    billboards?: Cesium.BillboardCollection;
    points?: Cesium.PointPrimitiveCollection;
    labels?: Cesium.LabelCollection;
    entities?: Cesium.Entity[];
  }
}
