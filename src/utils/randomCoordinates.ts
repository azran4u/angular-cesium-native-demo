import { BBox, randomPoint } from '@turf/turf';
import { Coordinate } from '../app/map.model';
import * as turf from '@turf/turf';

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

export function randomAirTrackCoordinates(n: number): Coordinate[] {
  return randomCoordinates(
    n,
    turf.bbox(
      turf.lineString([
        [32, 31],
        [36, 35],
      ])
    )
  );
}

export function singleRandomAirTrackCoordinate(): Coordinate {
  return randomAirTrackCoordinates(1)[0]
}
