import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EffectsModule} from '@ngrx/effects';
import {ClosedAreasMapEffects} from './closed-areas/closed-areas.map.effects';
import {AirTrackMapEffects} from './air-tracks/air-track.map.effects';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forFeature([ClosedAreasMapEffects, AirTrackMapEffects]),
  ]
})
export class EntitiesLayersModule {
}
