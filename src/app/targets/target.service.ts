import { Injectable } from '@angular/core';
import { randomLocalCoordinates } from 'src/utils/randomCoordinates';
import { Coordinate } from '../map/models/map.model';
import { v4 as uuidv4 } from 'uuid';
import { ComponentEntity, TargetEntity } from './target.model';

@Injectable({
  providedIn: 'root',
})
export class TargetSerivce {
  createTargets(amount: string): TargetEntity[] {
    return randomLocalCoordinates(parseInt(amount)).map((coordinate) => {
      return this.getEntity(coordinate);
    });
  }

  updateTargets(ids: string[]): TargetEntity[] {
    return randomLocalCoordinates(ids.length).map((coordinate, index) => {
      return this.getEntity(coordinate, ids[index]);
    });
  }

  private getEntity(
    coordinate: Coordinate,
    id: string = uuidv4()
  ): TargetEntity {
    return {
      id,
      coordinate,
      components: [
        this.getComponent(`${id}-${uuidv4()}`, coordinate),
        this.getComponent(`${id}-${uuidv4}`, {
          ...coordinate,
          longitude: coordinate.longitude + 0.05,
          latitude: coordinate.latitude + 0.05,
        }),
      ],
    };
  }

  private getComponent(id: string, coordinate: Coordinate): ComponentEntity {
    return {
      id,
      coordinate,
      boundryPolygon: [
        {
          ...coordinate,
          longitude: coordinate.longitude + 0.01,
          latitude: coordinate.latitude + 0.01,
        },
        {
          ...coordinate,
          longitude: coordinate.longitude + 0.01,
          latitude: coordinate.latitude - 0.01,
        },
        {
          ...coordinate,
          longitude: coordinate.longitude - 0.01,
          latitude: coordinate.latitude - 0.01,
        },
        {
          ...coordinate,
          longitude: coordinate.longitude - 0.01,
          latitude: coordinate.latitude + 0.01,
        },
      ],
    };
  }
}
