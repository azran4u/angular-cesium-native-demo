import {Injectable} from '@angular/core';
import {Coordinate} from '../../map/models/map.model';
import {randomLocalCoordinates} from '../../../utils/randomCoordinates';
import {v4 as uuidv4} from 'uuid';
import {random} from 'lodash';
import {ClosedAreaEntity, ClosedAreaTypeEnum} from '../closed-areas.models';

@Injectable({
  providedIn: 'root'
})
export class ClosedAreasService {
  createClosedAreas(amount: string): ClosedAreaEntity[] {
    return randomLocalCoordinates(parseInt(amount)).map((coordinate) => {
      return this.getEntity(coordinate)
    })
  }

  updateClosedAreas(ids: string[]): ClosedAreaEntity[] {
    return randomLocalCoordinates(ids.length)
      .map((coordinate, index) => {
        return this.getEntity(coordinate, ids[index]);
      })
  }

  private getEntity(coordinate: Coordinate, id: string = uuidv4()): ClosedAreaEntity {
    const types: ClosedAreaTypeEnum[] = [ClosedAreaTypeEnum.Medium, ClosedAreaTypeEnum.Small, ClosedAreaTypeEnum.Big]
    return {
      id,
      coordinate,
      radius: random(100, 1000),
      type: types[random(0, types.length)]
    }
  }
}
