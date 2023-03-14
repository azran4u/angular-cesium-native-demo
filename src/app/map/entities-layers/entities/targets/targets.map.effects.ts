import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { selectAllTargets } from 'src/app/targets/store/target.reducer';
import { TargetEntity } from 'src/app/targets/target.model';
import { BaseEntityMapEffects } from '../../base-entity.map.effects';
import { TargetsMapLayerControllerService } from './targets-map-layer-controller.service';

@Injectable()
export class TargetMapEffects extends BaseEntityMapEffects<TargetEntity> {
  constructor(
    protected override actions$: Actions,
    protected override store: Store,
    private targetLayer: TargetsMapLayerControllerService
  ) {
    super(actions$, store, targetLayer, selectAllTargets);
  }
  leftClickOnMultipleElementsHandler(elementIds: string[]): void {
    // TODO: dispatch whatever you want to do with the selected entities ids;
    console.log(this.targetLayer.layerType, elementIds);
  }
}
