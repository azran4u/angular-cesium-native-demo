import { Injectable } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { selectAllComponents, selectAllTargets } from "src/app/targets/store/target.reducer";
import { ComponentEntity, TargetEntity } from "src/app/targets/target.model";
import { BaseEntityMapEffects } from "../../base-entity.map.effects";
import { ComponentsMapLayerControllerService } from "./components-map-layer-controller.service";


@Injectable()
export class ComponentMapEffects extends BaseEntityMapEffects<ComponentEntity>{
  constructor(protected override actions$: Actions,
              protected override store: Store,
              private componentLayer: ComponentsMapLayerControllerService) {
    super(actions$, store, componentLayer, selectAllComponents);
  }
  leftClickOnMultipleElementsHandler(elementIds: string[]): void {
    // TODO: dispatch whatever you want to do with the selected entities ids;
    console.log(this.componentLayer.layerType, elementIds)
  }
}