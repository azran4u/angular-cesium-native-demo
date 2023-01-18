import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LayerSmapleComponent} from './layer-smaple/layer-smaple.component';
import {FormsModule} from '@angular/forms';
import {AirTrackModule} from './air-track/air-track.module';
import {ClosedAreasModule} from './closed-areas/closed-areas.module';
import {MapModule} from './map/map.module';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

@NgModule({
  declarations: [
    AppComponent,
    LayerSmapleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    AirTrackModule,
    ClosedAreasModule,
    MapModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
