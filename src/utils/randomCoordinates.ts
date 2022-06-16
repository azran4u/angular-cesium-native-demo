import { BBox, randomPoint } from '@turf/turf';
import { Coordinate } from '../app/map.model';

export function randomCoordinates(n: number, bbox: BBox): Coordinate[] {
  return randomPoint(10, {
    bbox,
  }).features.map((feature) => {
    return {
      latitude: feature.geometry.coordinates[0],
      longitude: feature.geometry.coordinates[1],
    } as Coordinate;
  });
}
