import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, tap } from "rxjs";
import { MapService } from "../map.service";
import { onSelectEntity } from "./map.actions";

@Injectable()
export class MapEffects {
    constructor(private actions$: Actions, private mapService: MapService){}

    onSelectEntity = createEffect(() =>
        this.actions$.pipe(
            ofType(onSelectEntity),
            tap(() => console.log('selected entity effect')),
            map(({selectedEntityId, layerName}) => {
                // if(selectedEntity.billboard) {
                //     selectedEntity.billboard.color = Cesium.Color.YELLOW
            
                //     selectedEntity.label = { text: 'selected', scale: 0.5, eyeOffset: [] }
                // }
                // this.mapService.updateAirplaneColorBlue(selectedEntityId, layerName)
                this.mapService.updateAirplaneColorYellow(selectedEntityId, layerName)
                // this.mapService.updateEntityPosition(selectedEntityId, layerName, singleRandomAirTrackCoordinate())
            })
        ),
        { dispatch: false }
    )
}
