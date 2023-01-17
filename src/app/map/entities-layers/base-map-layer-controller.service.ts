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

  protected constructor(private mapService: MapService, layer: MAP_LAYERS = MAP_LAYERS.DEFAULT) {
    this.layer = layer;
    this.mapService.viewerReady$.pipe(take(1)).subscribe(() => {
      this.createLayer().then();
    })
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

  abstract propertiesToListenWhenChangeHappens(): (keyof T)[]
}
