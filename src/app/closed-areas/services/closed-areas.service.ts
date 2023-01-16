import {Injectable} from '@angular/core';
import {AirTrackMapEntity, ClosedAreaMapEntity} from '../../map.model';
import {randomAirTrackCoordinates} from '../../../utils/randomCoordinates';
import {v4 as uuidv4} from 'uuid';
import {random} from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ClosedAreasService {
  createClosedAreas(amount: number): ClosedAreaMapEntity[] {
    return randomAirTrackCoordinates(amount).map((coordinate) => {
      return {
        id: uuidv4(),
        coordinate,
      };
    })
  }

  updateClosedAreas(ids: string[]): ClosedAreaMapEntity[] {
    return randomAirTrackCoordinates(ids.length).map((coordinate, index) => {
      return {
        id: ids[index],
        coordinate,
      };
    })
  }
}
