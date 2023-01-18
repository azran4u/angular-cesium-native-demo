import {createAction, props} from '@ngrx/store'
import {MAP_LAYERS} from '../models/map.model';

export enum MapActions {
  FOCUS_ON_ENTITIES = '[Map Actions] focus on entities',
  LEFT_CLICK_ON_SINGLE_ENTITY = '[Map Actions] left click on single entity',
  LEFT_CLICK_ON_MULTIPLE_ENTITIES = '[Map Actions] left click on multiple entities',
}

export const focusOnEntitiesAction = createAction(
  MapActions.FOCUS_ON_ENTITIES,
  props<{ layerName: MAP_LAYERS }>()
)

export const leftClickOnSingleEntityAction = createAction(
  MapActions.LEFT_CLICK_ON_SINGLE_ENTITY,
  props<{ id: string; layerName: MAP_LAYERS }>()
)

export const leftClickOnMultipleEntitiesAction = createAction(
  MapActions.LEFT_CLICK_ON_MULTIPLE_ENTITIES,
  props<{ payload: { [layerType in MAP_LAYERS]?: { id: string, layerType: MAP_LAYERS }[] } }>()
)
