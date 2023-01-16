import {Component, OnInit} from '@angular/core';
import {AirTrackMapLayerControllerService} from '../map/map-layer-controllers/air-track-map-layer-controller.service';
import {sleep} from 'src/utils/sleep';
import {AirTrackMapEntity, Coordinate, MAP_LAYERS} from '../map.model';
import {randomCoordinates} from '../../utils/randomCoordinates';
import * as turf from '@turf/turf';
import {
  ClosedAreaMapLayerControllerService
} from '../map/map-layer-controllers/closed-area-map-layer-controller.service';
import {Store} from '@ngrx/store';
import {AirTrackService} from '../air-track/services/air-track.service';
import {
  clearAirTracksAction,
  listenToAirTracksUpdatesAction,
  stopListenToAirTracksUpdatesAction,
  upsertAirTracksAction
} from '../air-track/store/air-track.actions';
import {focusOnEntitiesAction} from '../states/map.actions';
import {ClosedAreasService} from '../closed-areas/services/closed-areas.service';
import {
  clearClosedAreasAction,
  listenToClosedAreasUpdatesAction,
  stopListenToClosedAreasUpdatesAction,
  upsertClosedAreasAction
} from '../closed-areas/store/closed-areas.actions';

@Component({
  selector: 'app-layer-smaple',
  templateUrl: './layer-smaple.component.html',
  styleUrls: ['./layer-smaple.component.scss'],
})
export class LayerSmapleComponent implements OnInit {
  // inputId: Event;
  inputId: string;
  inputEntitiesAmount: number = 0;
  MapLayersEnum = MAP_LAYERS;

  constructor(
    private airTrackLayer: AirTrackMapLayerControllerService,
    private closedAreasLayer: ClosedAreaMapLayerControllerService,
    private airTrackService: AirTrackService,
    private closedAreasService: ClosedAreasService,
    private store: Store
  ) {
  }

  private shouldMove = false;

  async ngOnInit() {
    await this.airTrackLayer.createLayer();
    await this.closedAreasLayer.createLayer()
  }

  customAddAirplanes() {
    // dispatch airplanes to store
    const airtracks = this.airTrackService.createAirTracks(this.inputEntitiesAmount);
    this.store.dispatch(upsertAirTracksAction({airtracks}));
  }

  customAddCircles() {
    // dispatch closed areas to store
    const closedAreas = this.closedAreasService.createClosedAreas(this.inputEntitiesAmount);
    this.store.dispatch(upsertClosedAreasAction({closedAreas}))

  }

  async addAirTracks() {
    // await this.airTrackLayer.upsertEntities(this.createAirPlanes());
    // await this.airTrackLayer.focusOnEntities();
  }

  async addClosedAreas() {
    await this.closedAreasLayer.upsertEntities(this.createAirPlanes());
    await this.closedAreasLayer.focusOnEntities();
  }

  updateColor() {
    this.airTrackLayer.updateEntityColorById(this.inputId);
  }

  updatePosition() {
    this.airTrackLayer.updateEntityPosition(this.inputId, this.randomAirTrackCoordinates(1)[0])
  }

  remove() {
    this.airTrackLayer.removeAllEntitiesFromLayer();
  }

  hide() {
    this.airTrackLayer.hideLayer();
  }

  show() {
    this.airTrackLayer.showLayer();
  }

  focusOnEntities(layerName: MAP_LAYERS): void {
    this.store.dispatch(focusOnEntitiesAction({layerName}))
  }

  updateAirTracks(): void {
    this.store.dispatch(listenToAirTracksUpdatesAction())
  }

  stopUpdatingAirTracks(): void {
    this.store.dispatch(stopListenToAirTracksUpdatesAction())
  }

  updateClosedAreas(): void {
    this.store.dispatch(listenToClosedAreasUpdatesAction())
  }

  stopUpdatingClosedAreas(): void {
    this.store.dispatch(stopListenToClosedAreasUpdatesAction())
  }

  clearAllAirTracks(): void {
    this.store.dispatch(clearAirTracksAction())
  }

  clearAllClosedAreas(): void {
    this.store.dispatch(clearClosedAreasAction())
  }

  async focus() {
    await this.airTrackLayer.focusOnEntities();
  }

  async flyToEntity() {
    await this.airTrackLayer.flyToEntity(this.inputId);
  }

  stop_move() {
    this.shouldMove = false;
  }

  createAirPlanes(): AirTrackMapEntity[] {
    return [];
    // const airplanes = this.randomAirTrackCoordinates(10).map((coordinate) => {
    //   return {
    //     id: uuidv4(),
    //     coordinate,
    //   };
    // });
    // console.log(airplanes.map(a => a.id))
    // return airplanes
  }

  changeAirPlanePositionRandomly(
    airPlane: AirTrackMapEntity
  ): AirTrackMapEntity {
    return {
      ...airPlane,
      coordinate: this.randomAirTrackCoordinates(1)[0],
    };
  }

  private randomAirTrackCoordinates(n: number): Coordinate[] {
    return randomCoordinates(
      n,
      turf.bbox(
        turf.lineString([
          [32, 31],
          [36, 35],
        ])
      )
    );
  }
}
