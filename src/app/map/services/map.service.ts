import {Injectable} from '@angular/core';
import * as Cesium from 'cesium';
import {Entity, ScreenSpaceEventHandler, Viewer} from 'cesium';
import {debounceTime, Observable, ReplaySubject, Subject} from 'rxjs';
import {MAP_LAYERS} from '../models/map.model';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  viewerReady$:Observable<void>;
  private viewer: Viewer | undefined;

  private requestRender$ = new Subject<void>();
  private readonly changes: Subject<{
    added: Cesium.Entity[];
    removed: Cesium.Entity[];
    changed: Cesium.Entity[];
  }>;

  private readonly viewerReadyReplaySubject$ = new ReplaySubject<void>(1);
  private readonly leftClick$: Subject<{id:string; layerType:MAP_LAYERS}[]> = new Subject<{id:string; layerType:MAP_LAYERS}[]>();

  constructor() {
    this.changes = new Subject();
    this.requestRender$.pipe(debounceTime(500)).subscribe(() => {
      this.viewer?.scene.requestRender();
    })
    this.viewerReady$ = this.viewerReadyReplaySubject$.asObservable();
  }

  init(v: Viewer) {
    this.viewer = v;
    this.viewerReadyReplaySubject$.next();
    this.clickHandlers();
  }

  registerToLeftClickEvents(callback: (elements: any[]) => void): void {
    this.leftClick$.subscribe(callback);
  }

  private onChanged(collection: any, added: any, removed: any, changed: any) {
    this.changes.next({added, removed, changed});
  }

  async createLayer(name: MAP_LAYERS): Promise<void> {
    if (this.viewer?.dataSources.getByName(name).length === 0) {
      try {
        await this.viewer.dataSources.add(new Cesium.CustomDataSource(name));
        // await this.viewer.scene
      } catch (error) {
        console.error(error);
      }

      this.viewer.dataSources
        .getByName(name)[0]
        .entities.collectionChanged.addEventListener(this.onChanged.bind(this));
    }
  }

  clickHandlers(): void {
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer?.scene.canvas);
    // TODO: any
    handler.setInputAction((movement: ScreenSpaceEventHandler.PositionedEvent) => {
      const pick = this.viewer?.scene.drillPick(movement.position);
      if (Cesium.defined(pick) && pick?.length) {
        this.leftClick$.next(pick.map(element => element.id).map((entity: Cesium.Entity) => ({
          id: entity.id,
          layerType: entity?.properties?.getValue(new Cesium.JulianDate()).layerType
        })));
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  }

  trackChanges() {
    // TODO: see what we gain from this subject
    return this.changes;
  }

  upsertEntitiesToLayer(layer: string,
                        entitiesUpserted: Entity[],
                        entitiesRemoved: Entity[]): void {
    const ds = this.viewer?.dataSources.getByName(layer);
    const isLayerExists = ds?.length === 1;
    if (isLayerExists) {
      try {
        this.viewer?.entities.suspendEvents();
        // [...entitiesUpserted, ...entitiesRemoved].forEach((entity) => {
        //   ds[0].entities.remove(entity)
        //  });
        // ds[0].entities.suspendEvents()
        ds[0].entities.removeAll();
        entitiesUpserted.forEach((entity) => {
          ds[0].entities.add(entity);
        });
        // ds[0].entities.resumeEvents()
        this.viewer?.entities.resumeEvents();
        this.requestRender$.next();
      } catch (error) {
        console.error(error);
        // ignore already exists
      }
    }
  }

  getEntityById(id: string, layer: string): Entity | undefined {
    return this.viewer?.dataSources.getByName(layer)[0].entities.getById(id);
  }

  getEntities(layer: MAP_LAYERS): Cesium.Entity[] {
    const ds = this.viewer?.dataSources.getByName(layer);
    const isLayerExists = ds?.length === 1;
    if (isLayerExists) {
      return ds[0].entities.values;
    }
    return [];
  }

  showLayer(layer: MAP_LAYERS): void {
    const ds = this.viewer?.dataSources.getByName(layer);
    if (ds?.length === 1) {
      ds[0].show = true;
    }
  }

  hideLayer(layer: MAP_LAYERS): void {
    const ds = this.viewer?.dataSources.getByName(layer);
    if (ds?.length === 1) {
      ds[0].show = false;
    }
  }

  async flyTo(entity: Entity | Entity[]): Promise<void> {
    await this.viewer?.zoomTo(entity);
  }

  mouseHover() {
    // TODO: Come back here to handle the even properly. now i dont know what the use-case of hover on entity;
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
