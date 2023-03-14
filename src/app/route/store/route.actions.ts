import { createAction, props } from '@ngrx/store';
import { RouteEntity } from '../route.model';

export enum RouteActions {
  ADD_ROUTES = '[Route] add routes',
  PUT_ROUTES_IN_STATE = '[Route] put routes in state',
  UPDATE_SOME_ROUTES = '[Route] update some route',
  LISTEN_TO_ROUTES_UPDATES = '[Route] listen to route updates',
  STOP_LISTEN_TO_ROUTES_UPDATES = '[Route] stop listen to route updates',
  CLEAR_ROUTES = '[ROUTE] clear route',
}

export const upsertRoutesAction = createAction(
  RouteActions.ADD_ROUTES,
  props<{ amount?: number }>()
);

export const putRoutesInStateActions = createAction(
  RouteActions.PUT_ROUTES_IN_STATE,
  props<{ routes: RouteEntity[] }>()
);

export const updateSomeRoutesAction = createAction(
  RouteActions.UPDATE_SOME_ROUTES
);

export const listenToRoutesUpdatesAction = createAction(
  RouteActions.LISTEN_TO_ROUTES_UPDATES
);

export const stopListenToRoutesUpdatesAction = createAction(
  RouteActions.STOP_LISTEN_TO_ROUTES_UPDATES
);

export const clearRoutesAction = createAction(RouteActions.CLEAR_ROUTES);
