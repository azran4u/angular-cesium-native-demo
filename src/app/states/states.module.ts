import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { AirTrackEffects } from "./air-track-state/air-track.effects";
import { airTrackReducerToken, airTrackReducer } from "./air-track-state/air-track.reducer";
import { ClosedAreasEffects } from "./closed-areas/closed-areas.effects";
import { closedAreaReducer, closedAreaReducerToken } from "./closed-areas/closed-areas.reducer";
import { MapEffects } from "./map.effects";
import { mapReducerToken, mapReducer } from "./map.reducer";

@NgModule({
    declarations: [],
    imports: [
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      // EffectsModule.forFeature([ AirTrackEffects, MapEffects, ClosedAreasEffects ]),
      // StoreModule.forFeature(mapReducerToken, mapReducer),
      // StoreModule.forFeature(airTrackReducerToken, airTrackReducer),
      // StoreModule.forFeature(closedAreaReducerToken, closedAreaReducer)
    ],
    providers: [],
    bootstrap: [],
  })
  export class StatesModule {}