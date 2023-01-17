import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {ClosedAreasMapEffects} from '../entities-layers/closed-areas/closed-areas.map.effects';
import {MapEffects} from './map.effects';
import {mapReducer, mapReducerToken} from './map.reducer';
import {AirTrackMapEffects} from '../entities-layers/air-tracks/air-track.map.effects';

@NgModule({
    declarations: [],
    imports: [
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      EffectsModule.forFeature([ MapEffects, ClosedAreasMapEffects, AirTrackMapEffects ]),
      StoreModule.forFeature(mapReducerToken, mapReducer),
    ],
    providers: [],
    bootstrap: [],
  })
  export class StatesModule {}
