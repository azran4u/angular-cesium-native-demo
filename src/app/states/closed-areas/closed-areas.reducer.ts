import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createFeatureSelector, createReducer, on } from "@ngrx/store";
import { ClosedAreaMapEntity } from "src/app/map.model";
import { addClosedAreas } from "./closed-areas.actions";

export const closedAreaReducerToken = 'closed-areas-reducer';

export type closedAreaState = EntityState<ClosedAreaMapEntity>;

const closedAreaAdapter = createEntityAdapter<ClosedAreaMapEntity>();

export const closedAreaAdapterInitialState = closedAreaAdapter.getInitialState();

export const closedAreaReducer = createReducer(
    closedAreaAdapterInitialState,
    on(addClosedAreas, (state: closedAreaState, { closedAreas }) => 
        closedAreaAdapter.upsertMany(closedAreas, state)
    )
) 

export const selectClosedAreasState = createFeatureSelector<closedAreaState>(closedAreaReducerToken)

export const { selectAll: selectAllQClosedAreas } = 
    closedAreaAdapter.getSelectors(selectClosedAreasState)
