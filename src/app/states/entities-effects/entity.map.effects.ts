import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {filter, map, pairwise} from 'rxjs';
import * as MapActions from '../map.actions';
import {diffArrays} from '../../../utils/diff-arrays';
import {MapLayerControllerService} from '../../map/map-layer-controllers/map-layer-controller.service';
import {MapEntity} from '../../map.model';

export abstract class EntityMapEffects<T extends MapEntity> {
  selector
  protected constructor(protected actions$: Actions,
                        protected store: Store,
                        private entityLayerService: MapLayerControllerService<T>,
                        private entitySelector: (state: any) => T[]) {
    this.selector = entitySelector;
  }

  drawEntities$ = createEffect(() =>
      this.store.pipe(select(this.entitySelector)).pipe(
        // TODO: add filter
        pairwise(),
        map(async ([prev, curr]) => {
          const propertiesToCompare = this.entityLayerService.propertiesToListenWhenChangeHappens()
          const {add, update, remove} = diffArrays(prev, curr, propertiesToCompare);
          if (add.length || update.length || remove.length) {
            await this.entityLayerService.upsertAndDeleteEntities([...add, ...update], remove);
          }
        }),
      ),
    {dispatch: false}
  )

  focusOnEntities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MapActions.focusOnEntitiesAction),
      filter(({layerName}) => layerName === this.entityLayerService.layerType),
      map(async () => {
        await this.entityLayerService.focusOnEntities()
      })
    ), {dispatch: false}
  )
}
