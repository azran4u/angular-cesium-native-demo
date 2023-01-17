import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {filter, map, pairwise} from 'rxjs';
import * as MapActions from '../states/map.actions';
import {BaseMapLayerControllerService} from './base-map-layer-controller.service';
import {DrawableEntity} from '../models/map.model';

export abstract class BaseEntityMapEffects<T extends DrawableEntity> {
  selector

  protected constructor(protected actions$: Actions,
                        protected store: Store,
                        private entityLayerService: BaseMapLayerControllerService<T>,
                        private entitySelector: (state: any) => T[]) {
    this.selector = entitySelector;
  }

  drawEntities$ = createEffect(() =>
      this.store.pipe(select(this.entitySelector)).pipe(
        pairwise(),
        map(async ([prev, curr]) => {
          const propertiesToCompare = this.entityLayerService.propertiesToListenWhenChangeHappens()
          // const {add, update, remove} = diffArrays(prev, curr, propertiesToCompare);
          // if (add.length || update.length || remove.length) {
          await this.entityLayerService.upsertAndDeleteEntities(curr, []);
          // }
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
