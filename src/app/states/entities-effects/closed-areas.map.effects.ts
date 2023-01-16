import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {filter, map, pairwise} from 'rxjs';
import {
  ClosedAreaMapLayerControllerService
} from 'src/app/map/map-layer-controllers/closed-area-map-layer-controller.service';
import {selectAllClosedAreas} from '../../closed-areas/store/closed-areas.reducer';
import * as MapActions from '../map.actions';
import {diffArrays} from '../../../utils/diff-arrays';

@Injectable()
export class ClosedAreasMapEffects {
  constructor(private actions$: Actions,
              private store: Store,
              private closedAreasLayer: ClosedAreaMapLayerControllerService) {
  }

  drawEntities$ = createEffect(() =>
      this.store.select(selectAllClosedAreas).pipe(
        pairwise(),
        map(async ([prev, curr]) => {
          const propertiesToCompare = this.closedAreasLayer.propertiesToListenWhenChangeHappens()
          const {add, update, remove} = diffArrays(prev, curr, propertiesToCompare)
          await this.closedAreasLayer.upsertAndDeleteEntities([...add, ...update], remove);
        }),
      ),
    {dispatch: false}
  )

  focusOnEntities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MapActions.focusOnEntitiesAction),
      filter(({layerName}) => layerName === this.closedAreasLayer.layerType),
      map(async () => {
        await this.closedAreasLayer.focusOnEntities()
      })
    ), {dispatch: false}
  )
}
