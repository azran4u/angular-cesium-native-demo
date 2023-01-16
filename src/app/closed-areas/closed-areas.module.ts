import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {closedAreasReducer, closedAreasReducerToken} from './store/closed-areas.reducer';
import {EffectsModule} from '@ngrx/effects';
import {ClosedAreasEffects} from './store/closed-areas.effects';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forFeature([ ClosedAreasEffects ]),
    StoreModule.forFeature(closedAreasReducerToken, closedAreasReducer),
  ]
})
export class ClosedAreasModule { }
