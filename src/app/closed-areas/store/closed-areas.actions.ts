import {createAction, props} from '@ngrx/store';
import {ClosedAreaMapEntity} from 'src/app/map.model';

export enum ClosedAreasActions {
  ADD_CLOSED_AREAS = '[Closed Area] add closed areas',
  PUT_CLOSED_AREAS_IN_STATE = '[Closed Area] put closed areas in state',
  UPDATE_SOME_CLOSED_AREAS = '[Closed Area] update some closed areas',
  LISTEN_TO_CLOSED_AREAS_UPDATES = '[Closed Area] listen to closed areas updates',
  STOP_LISTEN_TO_CLOSED_AREAS_UPDATES = '[Closed Area] stop listen to closed areas updates',
  CLEAR_CLOSED_AREAS = '[Closed Area] clear closed areas',

}

export const upsertClosedAreasAction = createAction(
  ClosedAreasActions.ADD_CLOSED_AREAS,
  props<{ closedAreas: ClosedAreaMapEntity[] }>()
)

export const updateSomeClosedAreasAction = createAction(
  ClosedAreasActions.UPDATE_SOME_CLOSED_AREAS
)

export const putClosedAreasInStateActions = createAction(
  ClosedAreasActions.PUT_CLOSED_AREAS_IN_STATE,
  props<{ closedAreas: ClosedAreaMapEntity[] }>()
)

export const listenToClosedAreasUpdatesAction = createAction(
  ClosedAreasActions.LISTEN_TO_CLOSED_AREAS_UPDATES
)

export const stopListenToClosedAreasUpdatesAction = createAction(
  ClosedAreasActions.STOP_LISTEN_TO_CLOSED_AREAS_UPDATES
)

export const clearClosedAreasAction = createAction(
  ClosedAreasActions.CLEAR_CLOSED_AREAS
)
