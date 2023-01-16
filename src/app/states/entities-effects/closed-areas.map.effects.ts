import {Injectable} from '@angular/core';
import {Actions} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {
  ClosedAreaMapLayerControllerService
} from 'src/app/map/map-layer-controllers/closed-area-map-layer-controller.service';
import {selectAllClosedAreas} from '../../closed-areas/store/closed-areas.reducer';
import {EntityMapEffects} from './entity.map.effects';
import {ClosedAreaMapEntity} from '../../map.model';

@Injectable()
export class ClosedAreasMapEffects extends EntityMapEffects<ClosedAreaMapEntity> {
  constructor(protected override actions$: Actions,
              protected override store: Store,
              protected closedAreasLayer: ClosedAreaMapLayerControllerService,) {
    super(actions$, store, closedAreasLayer, selectAllClosedAreas)
  }
}
