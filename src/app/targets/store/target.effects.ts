import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { isNil, random, sampleSize } from 'lodash';
import { map, withLatestFrom } from 'rxjs';
import { TargetEntity } from '../target.model';
import { TargetSerivce } from '../target.service';
import {
  listenToTargetsUpdatesAction,
  putTargetsInStateActions,
  stopListenToTargetsUpdatesAction,
  updateSomeTargetsAction,
  upsertTargetsAction,
} from './target.actions';
import { selectAllTargets } from './target.reducer';

@Injectable()
export class TargetEffects {
  intervalId: number;

  constructor(
    private actions$: Actions,
    private store: Store,
    private targetService: TargetSerivce
  ) {}

  addTargets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(upsertTargetsAction),
      map(({ amount }) => {
        const targets = this.targetService.createTargets(
          (amount ?? 10).toString()
        );
        return putTargetsInStateActions({ targets });
      })
    )
  );

  updateSomeTargets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSomeTargetsAction),
      withLatestFrom(this.store.pipe(select(selectAllTargets))),
      map(([_, targets]) => {
        const sample: TargetEntity[] = sampleSize(
          targets,
          random(1, targets.length / 2)
        );
        const updatedEntities = this.targetService.updateTargets(
          sample.map((entity) => entity.id)
        );
        return putTargetsInStateActions({ targets: updatedEntities });
      })
    )
  );

  listenToTargetsUpdates$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(listenToTargetsUpdatesAction),
        map(() => {
          if (isNil(this.intervalId)) {
            // @ts-ignore
            this.intervalId = setInterval(() => {
              this.store.dispatch(updateSomeTargetsAction());
            }, 1000);
          }
        })
      ),
    { dispatch: false }
  );

  stopListenToTargetsUpdates$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stopListenToTargetsUpdatesAction),
        map(() => {
          if (!isNil(this.intervalId)) {
            clearInterval(this.intervalId);
          }
        })
      ),
    { dispatch: false }
  );
}
