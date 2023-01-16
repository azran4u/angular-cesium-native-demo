import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {createFeatureSelector, createReducer, on} from '@ngrx/store';
import {ClosedAreaMapEntity} from 'src/app/map.model';
import {clearClosedAreasAction, ClosedAreasActions, putClosedAreasInStateActions} from './closed-areas.actions';

export const closedAreasReducerToken = 'closed-areas-reducer';

export type ClosedAreasState = EntityState<ClosedAreaMapEntity>;

const closedAreasAdapter = createEntityAdapter<ClosedAreaMapEntity>();

export const closedAreasAdapterInitialState = closedAreasAdapter.getInitialState();

export const closedAreasReducer = createReducer(
  closedAreasAdapterInitialState,
  on(putClosedAreasInStateActions, upsertClosedAreasActionHandler),
  on(clearClosedAreasAction, clearClosedAreasActionHandler),
)

function upsertClosedAreasActionHandler(state: ClosedAreasState,
                                      {closedAreas}: { closedAreas: ClosedAreaMapEntity[] }): ClosedAreasState {
  return closedAreasAdapter.upsertMany(closedAreas, state);
}

function clearClosedAreasActionHandler(state:ClosedAreasState): ClosedAreasState {
  return closedAreasAdapter.removeAll(state);
}

export const selectClosedAreasState = createFeatureSelector<ClosedAreasState>(closedAreasReducerToken)

export const {selectAll: selectAllClosedAreas} =
  closedAreasAdapter.getSelectors(selectClosedAreasState)
