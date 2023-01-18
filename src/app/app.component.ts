import {Component, OnInit} from '@angular/core';
import {MapEventsHandlerService} from './map/services/map-events-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private mapEventsHandlerService: MapEventsHandlerService) {
  }

  ngOnInit(): void {
    this.mapEventsHandlerService.init()
  }
}
