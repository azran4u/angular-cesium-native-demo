import { Directive, ElementRef } from '@angular/core';
import { Viewer } from 'cesium';
import { MapService } from './map.service';
import * as Cesium from 'cesium';

@Directive({
  selector: '[appCesium]',
})
export class CesiumDirective {
  private viewer: Viewer;
  constructor(private el: ElementRef, private mapService: MapService) {
    Cesium.Ion.defaultAccessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMWYwNzc0Ny03ZGFiLTQ2NDMtYjBhYi04NGFkYTJhZWI1NDMiLCJpZCI6MTE4NjcwLCJpYXQiOjE2NzEzNjUyOTV9.Ufg2h7HVgqgPgCSJrMo9UVH0n-LP-sUNPGwoxT0UWhQ';
    console.log(`cesium directive constructor`);
    this.viewer = new Viewer(this.el.nativeElement, {
      sceneMode: Cesium.SceneMode.SCENE2D,
      baseLayerPicker: false,
      fullscreenButton: false,
      homeButton: false,
      infoBox: false,
      projectionPicker: false,
      navigationHelpButton: false,
      geocoder: false,
      sceneModePicker: false,
      vrButton: false,
      animation: false,
      timeline: false,
    });

    this.mapService.init(this.viewer);
  }

  getViewer(): Viewer {
    return this.viewer;
  }
}
