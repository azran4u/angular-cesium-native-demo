import {createAction, props} from '@ngrx/store'
import {MAP_LAYERS} from '../map.model';

export enum MapActions {
    ON_SELECT_ENTITY = '[Map Actions] on select entity',
    FOCUS_ON_ENTITIES = '[Map Actions] focus on entities',
}

export const onSelectEntity = createAction(
    MapActions.ON_SELECT_ENTITY,
    props<{ selectedEntityId: string, layerName: string }>()
)

export const focusOnEntitiesAction = createAction(
  MapActions.FOCUS_ON_ENTITIES,
  props<{layerName: MAP_LAYERS}>()
)
