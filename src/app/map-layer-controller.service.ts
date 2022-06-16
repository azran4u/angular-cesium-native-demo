import { Injectable } from '@angular/core';
import * as Cesium from 'cesium';
import { MapEntity, MAP_LAYERS } from './map.model';
import { MapService } from './map.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export abstract class MapLayerControllerService<T extends MapEntity> {
  protected currentEntities: T[] = [];
  private layer = MAP_LAYERS.DEFAULT;

  constructor(private mapService: MapService) {}

  setLayer(layer: MAP_LAYERS) {
    this.layer = layer;
  }

  async createLayer() {
    await this.mapService.createLayer(this.layer);
  }

  getCurrentEntities(): T[] {
    return this.currentEntities;
  }

  async upsertEntities(entities: T[]) {
    this.currentEntities = [...this.currentEntities, ...entities];
    this.renderCurrentEntitiesOnMap();
    this.showLayer();
  }

  renderCurrentEntitiesOnMap() {
    this.mapService.upsertEntitiesToLayer(
      this.layer,
      this.convertToCesiumEntity(this.currentEntities),
      []
    );
  }

  removeAllEntitiesFromLayer() {
    this.mapService.upsertEntitiesToLayer(
      this.layer,
      [],
      this.mapService.getEntities(this.layer)
    );
    this.currentEntities = [];
  }

  hideLayer() {
    this.mapService.hideLayer(this.layer);
  }

  showLayer() {
    this.mapService.showLayer(this.layer);
  }

  async focusOnEntities(entities?: T[]) {
    const entitiesToFocusOn = entities ?? this.currentEntities;
    await this.mapService.flyTo(this.mapService.getEntities(this.layer));
  }

  abstract convertToCesiumEntity(entities: T[]): Cesium.Entity[];
}
