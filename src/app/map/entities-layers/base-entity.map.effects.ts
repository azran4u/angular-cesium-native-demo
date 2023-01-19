import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {filter, map, pairwise} from 'rxjs';
import * as MapActions from '../actions/map.actions';
import {BaseMapLayerControllerService} from './base-map-layer-controller.service';
import {DrawableEntity} from '../models/map.model';
import {diffArrays} from '../../../utils/diff-arrays';

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
          console.log(curr.length)
          const propertiesToCompare = this.entityLayerService.propertiesToListenWhenChangeHappens()
          const {add, update, remove} = diffArrays(prev, curr, propertiesToCompare);
          this.entityLayerService.drawElementsOnMap(curr)
          if (add.length || update.length || remove.length) {
            console.log([...add, ...update].length, 'after')
            // const x = this.entityLayerService.convertToCesiumPrimitivesCollections(curr);
            // this.entityLayerService.upsertAndDeletePrimitives(x.billboardsCollection);
            // const entities = this.entityLayerService.convertToCesiumEntity(curr);
            // await this.entityLayerService.upsertEntities(curr);
            // await this.entityLayerService.upsertAndDeleteEntities(curr, []);
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


  leftClickOnMultipleElements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MapActions.leftClickOnMultipleEntitiesAction),
      filter(({payload}) => !!payload[this.entityLayerService.layerType]),
      map(({payload}) => payload[this.entityLayerService.layerType]?.map(entity => entity.id) ?? []),
      map((entitiesIds: string[]) => {
        this.leftClickOnMultipleElementsHandler(entitiesIds);
      })
    ), {dispatch: false}
  )

  abstract leftClickOnMultipleElementsHandler(elementIds: string[]): void
}
