import { Injectable } from '@angular/core';
import { Viewer, Entity } from 'cesium';
import * as Cesium from 'cesium';
import { Subject } from 'rxjs';
import { AirTrackMapEntity } from './map.model';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private viewer: Viewer | undefined;
  private changes: Subject<{
    added: Cesium.Entity[];
    removed: Cesium.Entity[];
    changed: Cesium.Entity[];
  }>;

  constructor() {
    this.changes = new Subject();
  }
  init(v: Viewer) {
    this.viewer = v;
  }

  private onChanged(collection: any, added: any, removed: any, changed: any) {
    this.changes.next({ added, removed, changed });
  }

  async createLayer(name: string) {
    if (this.viewer?.dataSources.getByName(name).length === 0) {
      await this.viewer.dataSources.add(new Cesium.CustomDataSource(name));
      this.viewer.dataSources
        .getByName(name)[0]
        .entities.collectionChanged.addEventListener(this.onChanged.bind(this));
    }
  }

  trackChanges() {
    return this.changes;
  }

  upsertEntitiesToLayer(
    layer: string,
    entitiesUpserted: Entity[],
    entitiesRemoved: Entity[]
  ) {
    const ds = this.viewer?.dataSources.getByName(layer);
    const isLayerExists = ds?.length === 1;
    if (isLayerExists) {
      try {
        this.viewer?.entities.suspendEvents();
        [...entitiesUpserted, ...entitiesRemoved].map((entity) =>
          ds[0].entities.remove(entity)
        );
        entitiesUpserted.map((entity) => ds[0].entities.add(entity));
        this.viewer?.entities.resumeEvents();
      } catch (error) {
        console.error(error);
        // ignore already exists
      }
    }
  }

  showLayer(layer: string) {
    const ds = this.viewer?.dataSources.getByName(layer);
    if (ds?.length === 1) {
      ds[0].show = true;
    }
  }

  hideLayer(layer: string) {
    const ds = this.viewer?.dataSources.getByName(layer);
    if (ds?.length === 1) {
      ds[0].show = false;
    }
  }

  async flyTo(entity: Entity) {
    await this.viewer?.zoomTo(entity);
  }

  mouseHover() {
    const handler = new Cesium.ScreenSpaceEventHandler(
      this.viewer?.scene.canvas
    );

    function mouseMoveHandlerFactory(viewer: Viewer) {
      return function mouseMoveHandler(movement: any) {
        const cartesian = viewer.camera.pickEllipsoid(
          movement.endPosition,
          viewer.scene.globe.ellipsoid
        );
        if (cartesian) {
          const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          const longitudeString = Cesium.Math.toDegrees(
            cartographic.longitude
          ).toFixed(2);
          const latitudeString = Cesium.Math.toDegrees(
            cartographic.latitude
          ).toFixed(2);
          console.log(`lat ${latitudeString} lon ${longitudeString}`);
        }
      };
    }

    const viewer = this.viewer;
    if (viewer) {
      handler.setInputAction(
        mouseMoveHandlerFactory(viewer),
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      );
    }
  }
}
