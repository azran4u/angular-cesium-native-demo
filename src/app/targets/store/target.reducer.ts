import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { TargetEntity } from '../target.model';
import { clearTargetsAction, putTargetsInStateActions } from './target.actions';

export const targetReducerToken = 'target-reducer';

export type TargetsState = EntityState<TargetEntity>;

const targetAdapter = createEntityAdapter<TargetEntity>();

export const targetAdapterInitialState = targetAdapter.getInitialState();

export const targetReducer = createReducer(
  targetAdapterInitialState,
  on(putTargetsInStateActions, upsertTargetsActionHandler),
  on(clearTargetsAction, clearTargetsActionHandler),
);

function upsertTargetsActionHandler(
  state: TargetsState,
  { targets }: { targets: TargetEntity[] }
): TargetsState {
  return targetAdapter.upsertMany(targets, state);
}

function clearTargetsActionHandler(state: TargetsState): TargetsState {
  return targetAdapter.removeAll(state);
}

export const selectTargetsState = createFeatureSelector<TargetsState>(targetReducerToken)

export const {selectAll: selectAllTargets} =
  targetAdapter.getSelectors(selectTargetsState)

  export const selectAllComponents = createSelector(selectAllTargets, targets => targets.flatMap(target => target.components))