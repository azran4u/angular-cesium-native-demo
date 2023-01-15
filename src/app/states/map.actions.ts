import {createAction, props} from '@ngrx/store'

export enum MapActions {
    ON_SELECT_ENTITY = '[Map Actionsss] on select entity'
}

export const onSelectEntity = createAction(
    MapActions.ON_SELECT_ENTITY, 
    props<{ selectedEntityId: string, layerName: string }>()
)
