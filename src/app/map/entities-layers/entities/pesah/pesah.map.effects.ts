import { Injectable } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { PesahEntity } from "src/app/pesah/pesah.model";
import { selectAllPesah } from "src/app/pesah/store/pesah.reducer";
import { BaseEntityMapEffects } from "../../base-entity.map.effects";
import { PesahMapLayerControllerService } from "./pesah-map-layer-controller.service";

@Injectable()
export class PesahMapEffects extends BaseEntityMapEffects<PesahEntity>{
  constructor(protected override actions$: Actions,
              protected override store: Store,
              private pesahLayer: PesahMapLayerControllerService) {
    super(actions$, store, pesahLayer, selectAllPesah);
  }
  leftClickOnMultipleElementsHandler(elementIds: string[]): void {
    // TODO: dispatch whatever you want to do with the selected entities ids;
    console.log(this.pesahLayer.layerType, elementIds)
  }
}