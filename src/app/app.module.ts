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
import { TargetModule } from './targets/target.modules';
import { RouteModule } from './route/route.module';
import { PesahModule } from './pesah/pesah.module';

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
    TargetModule,
    ClosedAreasModule,
    RouteModule,
    PesahModule,
    MapModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
