import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AirTrackMapLayerControllerService } from './map/map-layer-controllers/air-track-map-layer-controller';

import { AppComponent } from './app.component';
import { CesiumDirective } from './cesium.directive';
import { MapService } from './map.service';
import { MapComponent } from './map/map.component';
import { LayerSmapleComponent } from './layer-smaple/layer-smaple.component';
import { FormsModule } from '@angular/forms';
import { StatesModule } from './states/states.module';
import { AreaService } from './map/services/area.service';
import { ClosedAreaMapLayerControllerService } from './map/map-layer-controllers/closed-area-map-layer-controller';

@NgModule({
  declarations: [
    AppComponent,
    CesiumDirective,
    MapComponent,
    LayerSmapleComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule,
    StatesModule,
  ],
  providers: [MapService, AreaService, AirTrackMapLayerControllerService, ClosedAreaMapLayerControllerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
