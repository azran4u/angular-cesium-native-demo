import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {
  upsertAirTracksAction,
  putAirTracksInStateActions,
  updateSomeAirTracksAction,
  listenToAirTracksUpdatesAction, stopListenToAirTracksUpdatesAction
} from './air-track.actions';
import {map, withLatestFrom} from 'rxjs';
import {AirTrackService} from '../services/air-track.service';
import {selectAllQAirTracks} from './air-track.reducer';
import {isNil, random, sampleSize} from 'lodash';
import {AirTrackMapEntity} from '../../map.model';

@Injectable()
export class AirTrackEffects {
  intervalId: number;

  constructor(private actions$: Actions, private store: Store,
              private airTrackService: AirTrackService) {
  }

  addAirTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(upsertAirTracksAction),
      map(({airtracks}) => {
        return putAirTracksInStateActions({airtracks})
      })
    )
  )

  updateSomeAirTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSomeAirTracksAction),
      withLatestFrom(this.store.pipe(select(selectAllQAirTracks))),
      map(([_, airTracks]) => {
        const sample: AirTrackMapEntity[] = sampleSize(airTracks, random(1, airTracks.length / 2));
        const updatedEntities = this.airTrackService.updateAirTracks(sample.map(entity => entity.id));
        return putAirTracksInStateActions({airtracks: updatedEntities})
      })
    )
  )

  listenToAirTracksUpdates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(listenToAirTracksUpdatesAction),
      map(() => {
        if (isNil(this.intervalId)) {
          this.intervalId = setInterval(() => {
            this.store.dispatch(updateSomeAirTracksAction());
          }, 1000)
        }
      })
    ), {dispatch: false}
  )

  stopListenToAirTracksUpdates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(stopListenToAirTracksUpdatesAction),
      map(() => {
        if(!isNil(this.intervalId)) {
          clearInterval(this.intervalId)
        }
      })
    ), {dispatch: false}
  )

  // updateNonMapProperties$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(updateSomeAirTracksAction),
  //     withLatestFrom(this.store.pipe(select(selectAllQAirTracks))),
  //     map(([_, airTracks]) => {
  //       const sample: AirTrackMapEntity[] = sampleSize(airTracks, random(1, airTracks.length / 2));
  //
  //     })
  //   )
  // )
}
