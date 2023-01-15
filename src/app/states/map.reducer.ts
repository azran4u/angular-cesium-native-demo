import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer } from "@ngrx/store";

// TODO: does map need reducer?
export const mapReducerToken = 'map-reducer';

export type MapState = EntityState<any>;

const mapAdapter = createEntityAdapter<any>();

export const mapAdapterInitialState = mapAdapter.getInitialState();

export const mapReducer = createReducer(
    mapAdapterInitialState
) 
