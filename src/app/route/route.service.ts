import { Injectable } from '@angular/core';
import { randomLocalCoordinates } from 'src/utils/randomCoordinates';
import { Coordinate } from '../map/models/map.model';
import { RouteEntity } from './route.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  createRoutes(amount: string): RouteEntity[] {
    return randomLocalCoordinates(parseInt(amount)).map((coordinate) => {
      return this.getEntity(coordinate);
    });
  }

  updateRoutes(ids: string[]): RouteEntity[] {
    return randomLocalCoordinates(ids.length).map((coordinate, index) => {
      return this.getEntity(coordinate, ids[index]);
    });
  }

  private getEntity(
    coordinate: Coordinate,
    id: string = uuidv4()
  ): RouteEntity {
    const coordinates = [
      { ...coordinate, name: 'first' },
      { ...coordinate, latitude: coordinate.latitude + 0.01, name: 'second' },
      {
        ...coordinate,
        latitude: coordinate.latitude + 0.01,
        longitude: coordinate.longitude + 0.01,
        name: 'third',
      },
    ];
    return {
      id,
      coordinates,
      serialNumbers: {
        first: 1,
        second: 2,
        third: 3,
      },
    };
  }
}
