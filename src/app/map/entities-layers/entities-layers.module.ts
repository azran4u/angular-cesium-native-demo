import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EffectsModule} from '@ngrx/effects';
import {ClosedAreaMapEffects} from './entities/closed-areas/closed-area.map.effects';
import {AirTrackMapEffects} from './entities/air-tracks/air-track.map.effects';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forFeature([ClosedAreaMapEffects, AirTrackMapEffects]),
  ]
})
export class EntitiesLayersModule {
}
