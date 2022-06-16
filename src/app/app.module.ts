import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AirTrackMapLayerControllerService } from './air-track-map-layer-controller';

import { AppComponent } from './app.component';
import { CesiumDirective } from './cesium.directive';
import { MapLayerControllerService } from './map-layer-controller.service';
import { MapService } from './map.service';
import { MapComponent } from './map/map.component';
import { LayerSmapleComponent } from './layer-smaple/layer-smaple.component';

@NgModule({
  declarations: [
    AppComponent,
    CesiumDirective,
    MapComponent,
    LayerSmapleComponent,
  ],
  imports: [BrowserModule],
  providers: [MapService, AirTrackMapLayerControllerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
