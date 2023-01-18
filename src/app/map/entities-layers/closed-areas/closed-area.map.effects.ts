import {Injectable} from '@angular/core';
import {Actions} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {
  ClosedAreaMapLayerControllerService
} from 'src/app/map/entities-layers/closed-areas/closed-area-map-layer-controller.service';
import {selectAllClosedAreas} from '../../../closed-areas/store/closed-areas.reducer';
import {BaseEntityMapEffects} from '../base-entity.map.effects';
import {ClosedAreaEntity} from '../../../closed-areas/closed-areas.models';

@Injectable()
export class ClosedAreaMapEffects extends BaseEntityMapEffects<ClosedAreaEntity> {
  constructor(protected override actions$: Actions,
              protected override store: Store,
              protected closedAreasLayer: ClosedAreaMapLayerControllerService,) {
    super(actions$, store, closedAreasLayer, selectAllClosedAreas)
  }

  leftClickOnMultipleElementsHandler(elementIds: string[]): void {
    // TODO: dispatch whatever you want to do with the selected entities ids;
  }
}
