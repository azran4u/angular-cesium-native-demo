import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { RouteEntity } from '../route.model';
import { clearRoutesAction, putRoutesInStateActions } from './route.actions';

export const routeReducerToken = 'route-reducer';

export type RouteState = EntityState<RouteEntity>;

const routeAdapter = createEntityAdapter<RouteEntity>();

export const routeAdapterInitialState = routeAdapter.getInitialState();

export const routeReducer = createReducer(
  routeAdapterInitialState,
  on(putRoutesInStateActions, upsertRoutesActionHandler),
  on(clearRoutesAction, clearRoutesActionHandler),
);

function upsertRoutesActionHandler(
  state: RouteState,
  { routes }: { routes: RouteEntity[] }
): RouteState {
  return routeAdapter.upsertMany(routes, state);
}

function clearRoutesActionHandler(state: RouteState): RouteState {
  return routeAdapter.removeAll(state);
}

export const selectRoutesState =
  createFeatureSelector<RouteState>(routeReducerToken);

export const { selectAll: selectAllRoutes } =
  routeAdapter.getSelectors(selectRoutesState);
