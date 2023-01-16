import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {airTrackReducer, airTrackReducerToken} from './store/air-track.reducer';
import {EffectsModule} from '@ngrx/effects';
import {AirTrackEffects} from './store/air-track.effects';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forFeature([ AirTrackEffects ]),
    StoreModule.forFeature(airTrackReducerToken, airTrackReducer),
  ]
})
export class AirTrackModule { }
