import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {createFeatureSelector, createReducer, on} from '@ngrx/store';
import {clearClosedAreasAction, putClosedAreasInStateActions} from './closed-areas.actions';
import {ClosedAreaEntity} from '../closed-areas.models';

export const closedAreasReducerToken = 'closed-areas-reducer';

export type ClosedAreasState = EntityState<ClosedAreaEntity>;

const closedAreasAdapter = createEntityAdapter<ClosedAreaEntity>();

export const closedAreasAdapterInitialState = closedAreasAdapter.getInitialState();

export const closedAreasReducer = createReducer(
  closedAreasAdapterInitialState,
  on(putClosedAreasInStateActions, upsertClosedAreasActionHandler),
  on(clearClosedAreasAction, clearClosedAreasActionHandler),
)

function upsertClosedAreasActionHandler(state: ClosedAreasState,
                                        {closedAreas}: { closedAreas: ClosedAreaEntity[] }): ClosedAreasState {
  return closedAreasAdapter.upsertMany(closedAreas, state);
}

function clearClosedAreasActionHandler(state: ClosedAreasState): ClosedAreasState {
  return closedAreasAdapter.removeAll(state);
}

export const selectClosedAreasState = createFeatureSelector<ClosedAreasState>(closedAreasReducerToken)

export const {selectAll: selectAllClosedAreas} =
  closedAreasAdapter.getSelectors(selectClosedAreasState)
