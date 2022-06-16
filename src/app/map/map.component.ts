import { Component, OnInit, ViewChild } from '@angular/core';
import { CesiumDirective } from '../cesium.directive';
import { MAP_LAYERS } from '../map.model';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {}
