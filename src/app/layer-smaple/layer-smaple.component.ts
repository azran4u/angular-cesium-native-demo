import { Component } from '@angular/core';
import { MAP_LAYERS } from '../map/models/map.model';
import { Store } from '@ngrx/store';
import {
  clearAirTracksAction,
  listenToAirTracksUpdatesAction,
  stopListenToAirTracksUpdatesAction,
  updateNonMapAirTracksPropertiesAction,
  upsertAirTracksAction,
} from '../air-track/store/air-track.actions';
import { focusOnEntitiesAction } from '../map/actions/map.actions';
import {
  clearClosedAreasAction,
  listenToClosedAreasUpdatesAction,
  stopListenToClosedAreasUpdatesAction,
  upsertClosedAreasAction,
} from '../closed-areas/store/closed-areas.actions';
import {
  clearTargetsAction,
  listenToTargetsUpdatesAction,
  stopListenToTargetsUpdatesAction,
  upsertTargetsAction,
} from '../targets/store/target.actions';
import {
  clearRoutesAction,
  listenToRoutesUpdatesAction,
  stopListenToRoutesUpdatesAction,
  upsertRoutesAction,
} from '../route/store/route.actions';

@Component({
  selector: 'app-layer-smaple',
  templateUrl: './layer-smaple.component.html',
  styleUrls: ['./layer-smaple.component.scss'],
})
export class LayerSmapleComponent {
  inputEntitiesAmount: number | undefined = undefined;
  MapLayersEnum = MAP_LAYERS;

  constructor(private store: Store) {}

  customAddAirplanes() {
    this.store.dispatch(
      upsertAirTracksAction({ amount: this.inputEntitiesAmount })
    );
  }

  customAddCircles() {
    this.store.dispatch(
      upsertClosedAreasAction({ amount: this.inputEntitiesAmount })
    );
  }

  customAddTargets() {
    this.store.dispatch(
      upsertTargetsAction({ amount: this.inputEntitiesAmount })
    );
  }

  customAddRoutes() {
    this.store.dispatch(
      upsertRoutesAction({ amount: this.inputEntitiesAmount })
    );
  }

  focusOnEntities(layerName: MAP_LAYERS): void {
    this.store.dispatch(focusOnEntitiesAction({ layerName }));
  }

  updateAirTracks(): void {
    this.store.dispatch(listenToAirTracksUpdatesAction());
  }

  stopUpdatingAirTracks(): void {
    this.store.dispatch(stopListenToAirTracksUpdatesAction());
  }

  updateClosedAreas(): void {
    this.store.dispatch(listenToClosedAreasUpdatesAction());
  }

  stopUpdatingClosedAreas(): void {
    this.store.dispatch(stopListenToClosedAreasUpdatesAction());
  }

  updateTargets(): void {
    this.store.dispatch(listenToTargetsUpdatesAction());
  }

  stopUpdatingTargets(): void {
    this.store.dispatch(stopListenToTargetsUpdatesAction());
  }

  updateRoutes(): void {
    this.store.dispatch(listenToRoutesUpdatesAction());
  }

  stopUpdatingRoutes(): void {
    this.store.dispatch(stopListenToRoutesUpdatesAction());
  }

  clearAllAirTracks(): void {
    this.store.dispatch(clearAirTracksAction());
  }

  updateNonMapAirTracksProperties(): void {
    this.store.dispatch(updateNonMapAirTracksPropertiesAction());
  }

  clearAllClosedAreas(): void {
    this.store.dispatch(clearClosedAreasAction());
  }

  clearTargets(): void {
    this.store.dispatch(clearTargetsAction());
  }

  clearRoutes(): void {
    this.store.dispatch(clearRoutesAction());
  }
}
