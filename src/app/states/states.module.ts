import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { MapEffects } from "./map.effects";
import { mapReducerToken, mapReducer } from "./map.reducer";

@NgModule({
    declarations: [],
    imports: [
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      EffectsModule.forFeature([ MapEffects ]),
      StoreModule.forFeature(mapReducerToken, mapReducer)
    ],
    providers: [],
    bootstrap: [],
  })
  export class StatesModule {}