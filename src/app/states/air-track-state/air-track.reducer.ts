import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createFeatureSelector, createReducer, on } from "@ngrx/store";
import { AirTrackMapEntity } from "src/app/map.model";
import { addAirTracks } from "./air-track.actions";

export const airTrackReducerToken = 'air-track-reducer';

export type AirTrackState = EntityState<AirTrackMapEntity>;

const airTrackAdapter = createEntityAdapter<AirTrackMapEntity>();

export const airTrackAdapterInitialState = airTrackAdapter.getInitialState();

export const airTrackReducer = createReducer(
    airTrackAdapterInitialState,
    on(addAirTracks, (state: AirTrackState, { airtracks }) => 
        airTrackAdapter.upsertMany(airtracks, state)
    )
) 

export const selectAirTracksState = createFeatureSelector<AirTrackState>(airTrackReducerToken)

export const { selectAll: selectAllQAirTracks } = 
    airTrackAdapter.getSelectors(selectAirTracksState)
