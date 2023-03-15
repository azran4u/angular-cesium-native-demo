import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { isNil, random, sampleSize } from 'lodash';
import { map, withLatestFrom } from 'rxjs';
import { PesahEntity } from '../pesah.model';
import { PesahService } from '../pesah.service';
import { listenToPesahUpdatesAction, putPesahInStateActions, stopListenToPesahUpdatesAction, updateSomePesahAction, upsertPesahAction } from './pesah.actions';
import { selectAllPesah } from './pesah.reducer';

@Injectable()
export class PesahEffects {
  intervalId: number;

  constructor(
    private actions$: Actions,
    private store: Store,
    private pesahService: PesahService
  ) {}

  addPesah$ = createEffect(() =>
    this.actions$.pipe(
      ofType(upsertPesahAction),
      map(({ amount }) => {
        const pesah = this.pesahService.createPesah(
          (amount ?? 10).toString()
        );
        return putPesahInStateActions({ pesah });
      })
    )
  );

  updateSomePesah$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSomePesahAction),
      withLatestFrom(this.store.pipe(select(selectAllPesah))),
      map(([_, pesah]) => {
        const sample: PesahEntity[] = sampleSize(
          pesah,
          random(1, pesah.length / 2)
        );
        const updatedEntities = this.pesahService.updatePesah(
          sample.map((entity) => entity.id)
        );
        return putPesahInStateActions({ pesah: updatedEntities });
      })
    )
  );

  listenToPesahUpdates$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(listenToPesahUpdatesAction),
        map(() => {
          if (isNil(this.intervalId)) {
            // @ts-ignore
            this.intervalId = setInterval(() => {
              this.store.dispatch(updateSomePesahAction());
            }, 1000);
          }
        })
      ),
    { dispatch: false }
  );

  stopListenToPesahUpdates$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stopListenToPesahUpdatesAction),
        map(() => {
          if (!isNil(this.intervalId)) {
            clearInterval(this.intervalId);
          }
        })
      ),
    { dispatch: false }
  );
}
