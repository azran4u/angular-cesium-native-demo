import { Component } from '@angular/core';
import {MapService} from './map/services/map.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private mapService: MapService) {
    this.mapService.registerToLeftClickEvents((elements) => {
      // console.log({elements});
    })
  }
}
