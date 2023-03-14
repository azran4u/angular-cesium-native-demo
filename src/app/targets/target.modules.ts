import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import { TargetEffects } from './store/target.effects';
import { targetReducer, targetReducerToken } from './store/target.reducer';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forFeature([ TargetEffects ]),
    StoreModule.forFeature(targetReducerToken, targetReducer),
  ]
})
export class TargetModule { }
