import { Injectable } from '@angular/core';
import { Viewer, Entity } from 'cesium';
import * as Cesium from 'cesium';
import { Subject } from 'rxjs';
import { isNil } from 'lodash';

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
      try {
        await this.viewer.dataSources.add(new Cesium.CustomDataSource(name));
      } catch (error) {
        console.error(error);
      }

      this.viewer.dataSources
        .getByName(name)[0]
        .entities.collectionChanged.addEventListener(this.onChanged.bind(this));

      let previousPickedEntity: any;
      const handler = this.viewer.screenSpaceEventHandler;
      const viewer = this.viewer;

      

      handler.setInputAction(function (
        movement: Cesium.ScreenSpaceEventHandler.MotionEvent
      ) {
        var pickedPrimitive = viewer.scene.pick(movement.endPosition);
        var pickedEntity2 = viewer.selectedEntity;
        var pickedEntity = Cesium.defined(pickedPrimitive)
          ? pickedPrimitive.id
          : undefined;
        // Unhighlight the previously picked entity
        if (Cesium.defined(previousPickedEntity)) {
          previousPickedEntity.billboard.scale = 0.1;
          previousPickedEntity.billboard.color = Cesium.Color.RED;
        }
        // Highlight the currently picked entity
        if (
          pickedEntity &&
          pickedEntity.billboard &&
          Cesium.defined(pickedEntity) &&
          Cesium.defined(pickedEntity?.billboard)
        ) {
          console.log(`onHover: ${pickedEntity?.id}`);
          // @ts-ignore
          pickedEntity.billboard.scale = 0.3;
          // @ts-ignore
          pickedEntity.billboard.color = Cesium.Color.WHITE;
          previousPickedEntity = pickedEntity;
        }
      },
      Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      handler.setInputAction(function (
        position: Cesium.ScreenSpaceEventHandler.PositionedEvent
      ) {
        var pickedPrimitive = viewer.scene.pick(position.position);
        var pickedEntity = Cesium.defined(pickedPrimitive)
          ? pickedPrimitive.id
          : undefined;

        console.log(
          `onClick: ${isNil(pickedEntity) ? 'undefined' : pickedEntity?.id}`
        );
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK);
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
        entitiesUpserted.map((entity) => {
          const currentEntity = ds[0].entities.getById(entity.id);
          if (!!currentEntity) {
            ds[0].entities.removeById(entity.id);
          }
          ds[0].entities.add(entity);
        });
        this.viewer?.entities.resumeEvents();
      } catch (error) {
        console.error(error);
        // ignore already exists
      }
    }
  }

  getEntities(layer: string) {
    const ds = this.viewer?.dataSources.getByName(layer);
    const isLayerExists = ds?.length === 1;
    if (isLayerExists) {
      return ds[0].entities.values;
    }
    return [];
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

  async flyTo(entity: Entity | Entity[]) {
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
