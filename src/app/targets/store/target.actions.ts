import { createAction, props } from '@ngrx/store';
import { TargetEntity } from '../target.model';

export enum TargetActions {
  ADD_TARGETS = '[Target] add targets',
  PUT_TARGETS_IN_STATE = '[Target] put targets in state',
  UPDATE_SOME_TARGETS = '[Target] update some targets',
  LISTEN_TO_TARGETS_UPDATES = '[Target] listen to targets updates',
  STOP_LISTEN_TO_TARGETS_UPDATES = '[Target] stop listen to targets updates',
  CLEAR_TARGETS = '[Target] clear targets',
}

export const upsertTargetsAction = createAction(
  TargetActions.ADD_TARGETS,
  props<{ amount?: number }>()
);

export const putTargetsInStateActions = createAction(
  TargetActions.PUT_TARGETS_IN_STATE,
  props<{ targets: TargetEntity[] }>()
);

export const updateSomeTargetsAction = createAction(
  TargetActions.UPDATE_SOME_TARGETS
);

export const listenToTargetsUpdatesAction = createAction(
  TargetActions.LISTEN_TO_TARGETS_UPDATES
);

export const stopListenToTargetsUpdatesAction = createAction(
  TargetActions.STOP_LISTEN_TO_TARGETS_UPDATES
);

export const clearTargetsAction = createAction(TargetActions.CLEAR_TARGETS);
