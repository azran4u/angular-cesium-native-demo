import { Component, OnInit } from '@angular/core';
import { AirTrackMapLayerControllerService } from '../map/map-layer-controllers/air-track-map-layer-controller';
import { sleep } from 'src/utils/sleep';
import { AirTrackMapEntity, Coordinate } from '../map.model';
import { v4 as uuidv4 } from 'uuid';
import { randomCoordinates } from '../../utils/randomCoordinates';
import * as turf from '@turf/turf';
import { Event } from 'cesium';
import { ClosedAreaMapLayerControllerService } from '../map/map-layer-controllers/closed-area-map-layer-controller';
import { Store } from '@ngrx/store';
import { addAirTracks } from '../states/air-track-state/air-track.actions';
import { addClosedAreas } from '../states/closed-areas/closed-areas.actions';

@Component({
  selector: 'app-layer-smaple',
  templateUrl: './layer-smaple.component.html',
  styleUrls: ['./layer-smaple.component.scss'],
})
export class LayerSmapleComponent implements OnInit {
  // inputId: Event;
  inputId: string;
  inputEntitiesAmount: number = 0;

  constructor(
    private airTrackLayer: AirTrackMapLayerControllerService, 
    private closedAreasLayer: ClosedAreaMapLayerControllerService,
    private store: Store
  ) {}

  private shouldMove = false;

  async ngOnInit() {
    await this.airTrackLayer.createLayer();
    await this.closedAreasLayer.createLayer()
  }

  customAddAirplanes() {
    // dispatch airplanes to store
    
    this.store.dispatch(addAirTracks({ airtracks: this.airTrackLayer.createAirPlanes(this.inputEntitiesAmount)}))
  }

  customAddCircles() {
    // dispatch closed areas to store
    this.store.dispatch(addClosedAreas({ closedAreas: this.closedAreasLayer.createClosedAreas(this.inputEntitiesAmount)}))

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

  async focus() {
    await this.airTrackLayer.focusOnEntities();
  }
  
  async flyToEntity() {
    await this.airTrackLayer.flyToEntity(this.inputId);
  }

  stop_move() {
    this.shouldMove = false;
  }

  async move() {
    this.shouldMove = true;
    while (this.shouldMove) {
      this.airTrackLayer.upsertEntities(
        this.airTrackLayer
          .getCurrentEntities()
          .map((entity) => this.changeAirPlanePositionRandomly(entity))
      );
      await sleep(1000);
    }
  }

  createAirPlanes(): AirTrackMapEntity[] {
    const airplanes = this.randomAirTrackCoordinates(10).map((coordinate) => {
      return {
        id: uuidv4(),
        coordinate,
      };
    });
    console.log(airplanes.map(a => a.id))
    return airplanes
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
