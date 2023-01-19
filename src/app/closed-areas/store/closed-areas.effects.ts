import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {
  listenToClosedAreasUpdatesAction,
  putClosedAreasInStateActions,
  stopListenToClosedAreasUpdatesAction,
  updateSomeClosedAreasAction,
  upsertClosedAreasAction
} from './closed-areas.actions';
import {map, withLatestFrom} from 'rxjs';
import {ClosedAreasService} from '../services/closed-areas.service';
import {selectAllClosedAreas} from './closed-areas.reducer';
import {isNil, random, sampleSize} from 'lodash';
import {ClosedAreaEntity} from '../closed-areas.models';

@Injectable()
export class ClosedAreasEffects {
  intervalId: number;

  constructor(private actions$: Actions, private store: Store,
              private closedAreasService: ClosedAreasService) {
  }

  addClosedAreas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(upsertClosedAreasAction),
      map(({amount}) => {
        const closedAreas = this.closedAreasService.createClosedAreas((amount ?? 10).toString());
        return putClosedAreasInStateActions({closedAreas})
      })
    )
  )

  updateSomeClosedAreas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSomeClosedAreasAction),
      withLatestFrom(this.store.pipe(select(selectAllClosedAreas))),
      map(([_, closedAreas]) => {
        const sample: ClosedAreaEntity[] = sampleSize(closedAreas, random(1, closedAreas.length / 2));
        const updatedEntities = this.closedAreasService.updateClosedAreas(sample.map(entity => entity.id));
        return putClosedAreasInStateActions({closedAreas: updatedEntities})
      })
    )
  )

  listenToClosedAreasUpdates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(listenToClosedAreasUpdatesAction),
      map(() => {
        if (isNil(this.intervalId)) {
          // @ts-ignore
          this.intervalId = setInterval(() => {
            this.store.dispatch(updateSomeClosedAreasAction());
          }, 1000)
        }
      })
    ), {dispatch: false}
  )

  stopListenToClosedAreasUpdates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(stopListenToClosedAreasUpdatesAction),
      map(() => {
        if(!isNil(this.intervalId)) {
          clearInterval(this.intervalId)
        }
      })
    ), {dispatch: false}
  )
}
