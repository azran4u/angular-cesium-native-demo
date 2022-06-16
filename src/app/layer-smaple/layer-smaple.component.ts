import { Component, OnInit } from '@angular/core';
import { AirTrackMapLayerControllerService } from '../air-track-map-layer-controller';
import { sleep } from 'src/utils/sleep';
import { AirTrackMapEntity, Coordinate } from '../map.model';
import { v4 as uuidv4 } from 'uuid';
import { randomCoordinates } from '../../utils/randomCoordinates';
import * as turf from '@turf/turf';

@Component({
  selector: 'app-layer-smaple',
  templateUrl: './layer-smaple.component.html',
  styleUrls: ['./layer-smaple.component.scss'],
})
export class LayerSmapleComponent implements OnInit {
  private shouldMove = false;
  constructor(private airTrackLayer: AirTrackMapLayerControllerService) {}

  async ngOnInit() {
    await this.airTrackLayer.createLayer();
  }

  async add() {
    await this.airTrackLayer.upsertEntities(this.createAirPlanes());
    await this.airTrackLayer.focusOnEntities();
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
    return this.randomAirTrackCoordinates(10).map((coordinate) => {
      return {
        id: uuidv4(),
        coordinate,
      };
    });
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
