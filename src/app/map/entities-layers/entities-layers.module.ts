import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EffectsModule} from '@ngrx/effects';
import {ClosedAreaMapEffects} from './closed-areas/closed-area.map.effects';
import {AirTrackMapEffects} from './air-tracks/air-track.map.effects';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forFeature([ClosedAreaMapEffects, AirTrackMapEffects]),
  ]
})
export class EntitiesLayersModule {
}
