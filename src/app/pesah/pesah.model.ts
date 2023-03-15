import { SingleCoordinateDrawableEntity } from "../map/models/map.model";

export interface PesahEntity extends SingleCoordinateDrawableEntity {
    name: string;
    radius: number;
    color: string;
}