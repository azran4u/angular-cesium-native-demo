import { Component, OnInit } from '@angular/core';
import { AirTrackMapLayerControllerService } from '../air-track-map-layer-controller';
import { sleep } from 'src/utils/sleep';

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
    await this.airTrackLayer.upsertEntities(
      this.airTrackLayer.createAirPlanes()
    );
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
          .map((entity) =>
            this.airTrackLayer.changeAirPlanePositionRandomly(entity)
          )
      );
      await sleep(1000);
    }
  }
}
