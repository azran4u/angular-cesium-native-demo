import { MultiCoordinateDrawableEntity } from "../map/models/map.model";

export interface RouteEntity extends MultiCoordinateDrawableEntity {
    serialNumbers: Record<string, number>;
}