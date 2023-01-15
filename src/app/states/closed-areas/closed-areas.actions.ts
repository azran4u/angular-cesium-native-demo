import { createAction, props } from "@ngrx/store";
import { ClosedAreaMapEntity } from "src/app/map.model";

export enum ClosedAreaActions {
    ADD_CLOSED_AREAS = '[Closed Area] add closed areas'
}

export const addClosedAreas = createAction(
    ClosedAreaActions.ADD_CLOSED_AREAS,
    props<{ closedAreas: ClosedAreaMapEntity[] }>()
)
