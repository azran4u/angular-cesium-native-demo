import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { PesahEffects } from "./store/pesah.effects";
import { pesahReducer, pesahReducerToken } from "./store/pesah.reducer";

@NgModule({
    declarations: [],
    imports: [
      CommonModule,
      EffectsModule.forFeature([ PesahEffects ]),
      StoreModule.forFeature(pesahReducerToken, pesahReducer),
    ]
  })
  export class PesahModule { }