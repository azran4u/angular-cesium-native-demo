import {Injectable} from '@angular/core';
import {Actions} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {
  AirTrackMapLayerControllerService
} from 'src/app/map/map-layer-controllers/air-track-map-layer-controller.service';
import {selectAllQAirTracks} from '../../air-track/store/air-track.reducer';
import {EntityMapEffects} from './entity.map.effects';
import {AirTrackMapEntity} from '../../map.model';

@Injectable()
export class AirTrackMapEffects extends EntityMapEffects<AirTrackMapEntity>{
  constructor(protected override actions$: Actions,
              protected override store: Store,
              private airTrackLayer: AirTrackMapLayerControllerService) {
    super(actions$, store, airTrackLayer, selectAllQAirTracks);
  }
}
