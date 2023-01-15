import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { AirTrackMapEntity } from "src/app/map.model";
import { addAirTracks } from "./air-track.actions";

export const airTrackReducerToken = 'map-reducer';

export type AirTrackState = EntityState<AirTrackMapEntity>;

const airTrackAdapter = createEntityAdapter<AirTrackMapEntity>();

export const airTrackAdapterInitialState = airTrackAdapter.getInitialState();

export const mapReducer = createReducer(
    airTrackAdapterInitialState,
    on(addAirTracks)
) 
