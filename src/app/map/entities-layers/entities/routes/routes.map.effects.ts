import { Injectable } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { RouteEntity } from "src/app/route/route.model";
import { selectAllRoutes } from "src/app/route/store/route.reducer";
import { BaseEntityMapEffects } from "../../base-entity.map.effects";
import { RoutesMapLayerControllerService } from "./routes-map-layer-controller.service";

@Injectable()
export class RouteMapEffects extends BaseEntityMapEffects<RouteEntity>{
  constructor(protected override actions$: Actions,
              protected override store: Store,
              private routeLayer: RoutesMapLayerControllerService) {
    super(actions$, store, routeLayer, selectAllRoutes);
  }
  leftClickOnMultipleElementsHandler(elementIds: string[]): void {
    // TODO: dispatch whatever you want to do with the selected entities ids;
    console.log(this.routeLayer.layerType, elementIds)
  }
}