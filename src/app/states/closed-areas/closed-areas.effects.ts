import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, tap } from "rxjs";
import { ClosedAreaMapLayerControllerService } from "src/app/map/map-layer-controllers/closed-area-map-layer-controller";
import { selectAllQClosedAreas } from "./closed-areas.reducer";

@Injectable()
export class ClosedAreasEffects {
    constructor(private actions$: Actions, private store: Store,  private closedAreasLayer: ClosedAreaMapLayerControllerService){}

    selectAllQAirTracks$ = createEffect(() =>
        this.store.select(selectAllQClosedAreas).pipe(
            tap(async (closedAreas) => {
                await this.closedAreasLayer.upsertEntities(closedAreas);
                await this.closedAreasLayer.focusOnEntities();
            })
        ),
        { dispatch: false}
    )
}