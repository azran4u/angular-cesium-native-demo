import {Injectable} from '@angular/core';
import * as Cesium from 'cesium';
import {Coordinate, MAP_LAYERS, MapEntity} from '../../map.model';
import {MapService} from '../../map.service';

@Injectable({
  providedIn: 'root',
})
export abstract class MapLayerControllerService<T extends MapEntity> {
  private readonly layer: MAP_LAYERS = MAP_LAYERS.DEFAULT;

  protected constructor(private mapService: MapService, layer: MAP_LAYERS = MAP_LAYERS.DEFAULT) {
    this.layer = layer;
  }

  async createLayer() {
    await this.mapService.createLayer(this.layer);
  }

  get layerType(): MAP_LAYERS {
    return this.layer
  }

  upsertEntities(entities: T[]) {
    this.renderCurrentEntitiesOnMap(entities);
    this.showLayer();
  }

  upsertAndDeleteEntities(entitiesToUpsert:T[], entitiesToDelete: T[]): void {
    this.mapService.upsertEntitiesToLayer(
      this.layer,
      this.convertToCesiumEntity(entitiesToUpsert),
      this.convertToCesiumEntity(entitiesToDelete)
    );
  }

  renderCurrentEntitiesOnMap(entities:T[]) {
    this.mapService.upsertEntitiesToLayer(
      this.layer,
      this.convertToCesiumEntity(entities),
      []
    );
  }

  updateEntityColorById(id: string) {
    this.mapService.updateAirplaneColorBlue(id, this.layer)
  }

  updateEntityColorOnClick(id: string) {
    this.mapService.updateAirplaneColorYellow(id, this.layer)
  }

  updateEntityPosition(id: string, position: Coordinate) {
    this.mapService.updateEntityPosition(id, this.layer, position)
  }

  removeAllEntitiesFromLayer() {
    this.mapService.upsertEntitiesToLayer(
      this.layer,
      [],
      this.mapService.getEntities(this.layer)
    );
  }

  hideLayer() {
    this.mapService.hideLayer(this.layer);
  }

  showLayer() {
    this.mapService.showLayer(this.layer);
  }

  async focusOnEntities(entities?: T[]) {
    // const entitiesToFocusOn = entities ?? this.currentEntities;
    await this.mapService.flyTo(this.mapService.getEntities(this.layer));
  }

  async flyToEntity(id: string) {
    await this.mapService.flyTo(this.mapService.getEntityById(id, this.layer) ?? []);
  }

  abstract convertToCesiumEntity(entities: T[]): Cesium.Entity[];

  abstract propertiesToListenWhenChangeHappens(): (keyof T)[]
}
