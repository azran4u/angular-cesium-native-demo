import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, tap } from "rxjs";
import { AirTrackMapLayerControllerService } from "src/app/map/map-layer-controllers/air-track-map-layer-controller";
import { selectAllQAirTracks } from "./air-track.reducer";

@Injectable()
export class AirTrackEffects {
    constructor(private actions$: Actions, private store: Store,  private airTrackLayer: AirTrackMapLayerControllerService){}

    selectAllQAirTracks$ = createEffect(() =>
        this.store.select(selectAllQAirTracks).pipe(
            tap(async (airTracks) => {
                await this.airTrackLayer.upsertEntities(airTracks);
                await this.airTrackLayer.focusOnEntities();
            })
        ),
        { dispatch: false}
    )
}