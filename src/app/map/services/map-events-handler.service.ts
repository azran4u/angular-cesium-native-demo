import {Injectable} from '@angular/core';
import {MapService} from './map.service';
import {Store} from '@ngrx/store';
import {MAP_LAYERS} from '../models/map.model';
import {leftClickOnMultipleEntitiesAction} from '../actions/map.actions';
import {groupBy} from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class MapEventsHandlerService {

  constructor(private mapService: MapService,
              private store: Store) {
  }

  init(): void {
    this.mapService.registerToLeftClickEvents(this.mapLeftClickHandler.bind(this))
  }

  private mapLeftClickHandler(elements: { id: string; layerType: MAP_LAYERS } []): void {
    const elementsGroupedByLayerType: { [layerType in MAP_LAYERS]?: { id: string; layerType: MAP_LAYERS }[] } = groupBy(elements, element => element.layerType);
    this.store.dispatch(leftClickOnMultipleEntitiesAction({payload: elementsGroupedByLayerType}))
  }
}
