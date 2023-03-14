import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { RouteEffects } from "./store/route.effects";
import { routeReducer, routeReducerToken } from "./store/route.reducer";

@NgModule({
    declarations: [],
    imports: [
      CommonModule,
      EffectsModule.forFeature([ RouteEffects ]),
      StoreModule.forFeature(routeReducerToken, routeReducer),
    ]
  })
  export class RouteModule { }