import {BBox, randomPoint} from '@turf/turf';
import {Coordinate} from '../app/map/models/map.model';
import * as turf from '@turf/turf';
import {random} from 'lodash';

export function randomCoordinates(n: number, bbox: BBox): Coordinate[] {
  return randomPoint(n, {
    bbox,
  }).features.map((feature) => {
    return {
      latitude: feature.geometry.coordinates[0],
      longitude: feature.geometry.coordinates[1],
    } as Coordinate;
  });
}

export function randomLocalCoordinates(n: number): Coordinate[] {
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

export const getRandomCoordinates = (): Coordinate => {
  const latitude = random(31, 35, true);
  const longitude = random(32, 36, true);
  return {latitude, longitude}
}

export function singleRandomAirTrackCoordinate(): Coordinate {
  return randomLocalCoordinates(1)[0]
}
