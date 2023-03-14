import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { isNil, random, sampleSize } from 'lodash';
import { map, withLatestFrom } from 'rxjs';
import { RouteEntity } from '../route.model';
import { RouteService } from '../route.service';
import {
  listenToRoutesUpdatesAction,
  putRoutesInStateActions,
  stopListenToRoutesUpdatesAction,
  updateSomeRoutesAction,
  upsertRoutesAction,
} from './route.actions';
import { selectAllRoutes } from './route.reducer';

@Injectable()
export class RouteEffects {
  intervalId: number;

  constructor(
    private actions$: Actions,
    private store: Store,
    private routeService: RouteService
  ) {}

  addRoutes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(upsertRoutesAction),
      map(({ amount }) => {
        const routes = this.routeService.createRoutes(
          (amount ?? 2).toString()
        );
        return putRoutesInStateActions({ routes });
      })
    )
  );

  updateSomeRoutes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSomeRoutesAction),
      withLatestFrom(this.store.pipe(select(selectAllRoutes))),
      map(([_, routes]) => {
        const sample: RouteEntity[] = sampleSize(
          routes,
          random(1, routes.length / 2)
        );
        const updatedEntities = this.routeService.updateRoutes(
          sample.map((entity) => entity.id)
        );
        return putRoutesInStateActions({ routes: updatedEntities });
      })
    )
  );

  listenToRoutesUpdates$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(listenToRoutesUpdatesAction),
        map(() => {
          if (isNil(this.intervalId)) {
            // @ts-ignore
            this.intervalId = setInterval(() => {
              this.store.dispatch(updateSomeRoutesAction());
            }, 1000);
          }
        })
      ),
    { dispatch: false }
  );

  stopListenToRoutesUpdates$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stopListenToRoutesUpdatesAction),
        map(() => {
          if (!isNil(this.intervalId)) {
            clearInterval(this.intervalId);
          }
        })
      ),
    { dispatch: false }
  );
}
