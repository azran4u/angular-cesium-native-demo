import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LayerSmapleComponent} from './layer-smaple/layer-smaple.component';
import {FormsModule} from '@angular/forms';
import {StatesModule} from './map/states/states.module';
import {AirTrackModule} from './air-track/air-track.module';
import {ClosedAreasModule} from './closed-areas/closed-areas.module';
import {MapModule} from './map/map.module';

@NgModule({
  declarations: [
    AppComponent,
    LayerSmapleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AirTrackModule,
    ClosedAreasModule,
    MapModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
