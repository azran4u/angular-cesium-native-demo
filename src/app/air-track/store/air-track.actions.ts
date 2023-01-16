import {createAction, props} from '@ngrx/store';
import {AirTrackMapEntity} from 'src/app/map.model';

export enum AirTrackActions {
  ADD_AIR_TRACKS = '[Air Track] add air tracks',
  PUT_AIR_TRACKS_IN_STATE = '[Air Track] put air tracks in state',
  UPDATE_SOME_AIR_TRACKS = '[Air Track] update some air tracks',
  LISTEN_TO_AIR_TRACKS_UPDATES = '[Air Track] listen to air tracks updates',
  STOP_LISTEN_TO_AIR_TRACKS_UPDATES = '[Air Track] stop listen to air tracks updates',
  CLEAR_AIR_TRACKS = '[Air Track] clear air tracks',
  UPDATE_NON_MAP_PROPERTIES = '[Air Track] update non map properties',

}

export const upsertAirTracksAction = createAction(
  AirTrackActions.ADD_AIR_TRACKS,
  props<{ airtracks: AirTrackMapEntity[] }>()
)

export const updateSomeAirTracksAction = createAction(
  AirTrackActions.UPDATE_SOME_AIR_TRACKS
)

export const putAirTracksInStateActions = createAction(
  AirTrackActions.PUT_AIR_TRACKS_IN_STATE,
  props<{ airtracks: AirTrackMapEntity[] }>()
)

export const listenToAirTracksUpdatesAction = createAction(
  AirTrackActions.LISTEN_TO_AIR_TRACKS_UPDATES
)

export const stopListenToAirTracksUpdatesAction = createAction(
  AirTrackActions.STOP_LISTEN_TO_AIR_TRACKS_UPDATES
)

export const clearAirTracksAction = createAction(
  AirTrackActions.CLEAR_AIR_TRACKS
)

export const updateNonMapAirTracksPropertiesAction = createAction(
  AirTrackActions.UPDATE_NON_MAP_PROPERTIES
)
