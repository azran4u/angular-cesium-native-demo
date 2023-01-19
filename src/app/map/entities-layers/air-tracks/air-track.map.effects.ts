import {Injectable} from '@angular/core';
import {Actions} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {
  AirTrackMapLayerControllerService
} from 'src/app/map/entities-layers/air-tracks/air-track-map-layer-controller.service';
import {selectAllAirTracks} from '../../../air-track/store/air-track.reducer';
import {BaseEntityMapEffects} from '../base-entity.map.effects';
import {AirTrackEntity} from '../../../air-track/air-track.models';

@Injectable()
export class AirTrackMapEffects extends BaseEntityMapEffects<AirTrackEntity>{
  constructor(protected override actions$: Actions,
              protected override store: Store,
              private airTrackLayer: AirTrackMapLayerControllerService) {
    super(actions$, store, airTrackLayer, selectAllAirTracks);
  }
  leftClickOnMultipleElementsHandler(elementIds: string[]): void {
    // TODO: dispatch whatever you want to do with the selected entities ids;
    console.log(this.airTrackLayer.layerType, elementIds)
  }
}
