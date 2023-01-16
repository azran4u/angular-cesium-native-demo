import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {filter, map, pairwise} from 'rxjs';
import {
  AirTrackMapLayerControllerService
} from 'src/app/map/map-layer-controllers/air-track-map-layer-controller.service';
import {selectAllQAirTracks} from '../../air-track/store/air-track.reducer';
import * as MapActions from '../map.actions';
import {diffArrays} from '../../../utils/diff-arrays';

@Injectable()
export class AirTrackMapEffects {
  constructor(private actions$: Actions,
              private store: Store,
              private airTrackLayer: AirTrackMapLayerControllerService) {
  }

  drawEntities$ = createEffect(() =>
      this.store.select(selectAllQAirTracks).pipe(
        pairwise(),
        map(async ([prev, curr]) => {
          const propertiesToCompare = this.airTrackLayer.propertiesToListenWhenChangeHappens()
          const {add, update, remove} = diffArrays(prev, curr, propertiesToCompare)
          await this.airTrackLayer.upsertAndDeleteEntities([...add, ...update], remove);
        }),
      ),
    {dispatch: false}
  )

  focusOnEntities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MapActions.focusOnEntitiesAction),
      filter(({layerName}) => layerName === this.airTrackLayer.layerType),
      map(async () => {
        await this.airTrackLayer.focusOnEntities()
      })
    ), {dispatch: false}
  )
}
