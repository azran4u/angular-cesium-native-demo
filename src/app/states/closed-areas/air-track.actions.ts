import { createAction, props } from "@ngrx/store";
import { AirTrackMapEntity } from "src/app/map.model";

export enum AirTrackActions {
    ADD_AIR_TRACKS = '[Air Track] add air tracks'
}

export const addAirTracks = createAction(
    AirTrackActions.ADD_AIR_TRACKS,
    props<{ airtracks: AirTrackMapEntity[] }>()
)
