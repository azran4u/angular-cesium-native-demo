import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {createFeatureSelector, createReducer, on} from '@ngrx/store';
import {clearAirTracksAction, putAirTracksInStateActions} from './air-track.actions';
import {AirTrackEntity} from '../air-track.models';

export const airTrackReducerToken = 'air-track-reducer';

export type AirTrackState = EntityState<AirTrackEntity>;

const airTrackAdapter = createEntityAdapter<AirTrackEntity>();

export const airTrackAdapterInitialState = airTrackAdapter.getInitialState();

export const airTrackReducer = createReducer(
  airTrackAdapterInitialState,
  on(putAirTracksInStateActions, upsertAirTracksActionHandler),
  on(clearAirTracksAction, clearAirTracksActionHandler),
)

function upsertAirTracksActionHandler(state: AirTrackState,
                                      {airtracks}: { airtracks: AirTrackEntity[] }): AirTrackState {
  return airTrackAdapter.upsertMany(airtracks, state);
}

function clearAirTracksActionHandler(state:AirTrackState): AirTrackState {
  return airTrackAdapter.removeAll(state);
}

export const selectAirTracksState = createFeatureSelector<AirTrackState>(airTrackReducerToken)

export const {selectAll: selectAllAirTracks} =
  airTrackAdapter.getSelectors(selectAirTracksState)
