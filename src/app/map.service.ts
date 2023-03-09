import { Injectable } from '@angular/core';
import {
  Viewer,
  Entity,
  Cartesian3,
  ConstantPositionProperty,
  Fullscreen,
} from 'cesium';
import * as Cesium from 'cesium';
import { Subject } from 'rxjs';
import { Coordinate, MAP_LAYERS, MapEntity } from './map.model';
import { Store } from '@ngrx/store';
import { onSelectEntity } from './states/map.actions';
import { AreaService } from './map/services/area.service';
import { singleRandomAirTrackCoordinate } from 'src/utils/randomCoordinates';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private viewer: Viewer | undefined;
  private readonly changes: Subject<{
    added: Cesium.Entity[];
    removed: Cesium.Entity[];
    changed: Cesium.Entity[];
  }>;

  private readonly leftClick$: Subject<any[]> = new Subject<any[]>();

  constructor(private store: Store) {
    this.changes = new Subject();
  }

  init(v: Viewer) {
    this.viewer = v;
    this.clickHandlers();
  }

  registerToLeftClickEvents(callback: (elements: any[]) => void): void {
    this.leftClick$.subscribe(callback);
  }

  private onChanged(collection: any, added: any, removed: any, changed: any) {
    this.changes.next({ added, removed, changed });
  }

  async createLayer(name: string) {
    if (this.viewer?.dataSources.getByName(name).length === 0) {
      try {
        await this.viewer.dataSources.add(new Cesium.CustomDataSource(name));
        await this.viewer.scene;
      } catch (error) {
        console.error(error);
      }

      this.viewer.dataSources
        .getByName(name)[0]
        .entities.collectionChanged.addEventListener(this.onChanged.bind(this));
    }
  }

  onClick(selectedEntity: any) {
    console.log(selectedEntity.position);
    AreaService.getCirclePolylineOutlinePositions(
      singleRandomAirTrackCoordinate(),
      500000
    );
    if (selectedEntity) {
      this.store.dispatch(
        onSelectEntity({
          selectedEntityId: selectedEntity.id,
          layerName: selectedEntity.entityCollection.owner.name,
        })
      );
    }
  }

  clickHandlers(): void {
    const handler = new Cesium.ScreenSpaceEventHandler(
      this.viewer?.scene.canvas
    );
    // TODO: any
    handler.setInputAction(
      (movement: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const pick = this.viewer?.scene.drillPick(movement.position);
        if (Cesium.defined(pick) && pick?.length) {
          this.leftClick$.next(
            pick
              .map((element) => element.id)
              .map((entity: Cesium.Entity) => ({
                id: entity.id,
                layerType: entity?.properties?.getValue(new Cesium.JulianDate())
                  .layerType,
              }))
          );
        }
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
  }

  trackChanges() {
    return this.changes;
  }

  // TODO: updateLayerEntities
  // layer should be an ENUM
  // removed should be ID's only. use removeById method
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
        [...entitiesUpserted, ...entitiesRemoved].forEach((entity) => {
          ds[0].entities.remove(entity);
        });
        entitiesUpserted.map((entity) => {
          ds[0].entities.add(entity);
        });
        this.viewer?.entities.resumeEvents();
      } catch (error) {
        console.error(error);
        // ignore already exists
      }
    }
  }

  // TODO: mapService is a global low level service that should not know about specific layers
  // layer should be first and then the id
  // we may need to create an interface that represents MapEntityId that contains both layer and id
  // interface MapEntityId {layer: LayerEnum, is: string}
  updateAirplaneColorBlue(id: string, layer: string) {
    const airplaneToUpdate = this.getEntityById(id, layer);

    if (airplaneToUpdate?.billboard) {
      // TODO: invesitgate the type error so we can remove "as any"
      airplaneToUpdate.billboard.color = Cesium.Color.BLUE as any;
    }
  }

  // TODO: this function should get an Entity and not pass the input to another function
  updateAirplaneColorYellow(id: string, layer: string) {
    const airplaneToUpdate = this.getEntityById(id, layer);

    if (airplaneToUpdate?.billboard) {
      airplaneToUpdate.billboard.color = Cesium.Color.YELLOW as any;
    }
  }

  updateEntityPosition(id: string, layer: string, newPosition: Coordinate) {
    const airplaneToUpdate = this.getEntityById(id, layer);

    if (airplaneToUpdate?.billboard) {
      airplaneToUpdate.position = new ConstantPositionProperty(
        new Cartesian3(newPosition.latitude, newPosition.longitude)
      ) as any;
    }
  }

  getEntityById(id: string, layer: string) {
    return this.viewer?.dataSources.getByName(layer)[0].entities.getById(id);
  }

  getEntities(layer: MAP_LAYERS): Cesium.Entity[] {
    // TODO: next line apperas multiple times, extract to function
    const ds = this.viewer?.dataSources.getByName(layer);
    const isLayerExists = ds?.length === 1;
    if (isLayerExists) {
      return ds[0].entities.values;
    }
    return [];
  }

  showLayer(layer: string) {
    // TODO: next line apperas multiple times, extract to function
    const ds = this.viewer?.dataSources.getByName(layer);
    if (ds?.length === 1) {
      ds[0].show = true;
    }
  }

  hideLayer(layer: string) {
    // TODO: next line apperas multiple times, extract to function
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
      return function mouseMoveHandler(
        movement: Cesium.ScreenSpaceEventHandler.MotionEvent
      ) {
        const cartesian = viewer.camera.pickEllipsoid(
          movement.endPosition,
          viewer.scene.globe.ellipsoid
        );
        if (cartesian) {
          const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          // 1. don't change precision here. This function should return the highest precision
          // and the user of this function should decide what precision is sufficient for his use case.
          // 2. the output should be emmited somehow
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
