import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {createFeatureSelector, createReducer, on} from '@ngrx/store';
import {AirTrackMapEntity} from 'src/app/map.model';
import {clearAirTracksAction, putAirTracksInStateActions, upsertAirTracksAction} from './air-track.actions';

export const airTrackReducerToken = 'air-track-reducer';

export type AirTrackState = EntityState<AirTrackMapEntity>;

const airTrackAdapter = createEntityAdapter<AirTrackMapEntity>();

export const airTrackAdapterInitialState = airTrackAdapter.getInitialState();

export const airTrackReducer = createReducer(
  airTrackAdapterInitialState,
  on(putAirTracksInStateActions, upsertAirTracksActionHandler),
  on(clearAirTracksAction, clearAirTracksActionHandler),
)

function upsertAirTracksActionHandler(state: AirTrackState,
                                      {airtracks}: { airtracks: AirTrackMapEntity[] }): AirTrackState {
  return airTrackAdapter.upsertMany(airtracks, state);
}

function clearAirTracksActionHandler(state:AirTrackState): AirTrackState {
  return airTrackAdapter.removeAll(state);
}

export const selectAirTracksState = createFeatureSelector<AirTrackState>(airTrackReducerToken)

export const {selectAll: selectAllQAirTracks} =
  airTrackAdapter.getSelectors(selectAirTracksState)
