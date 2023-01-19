import {Injectable} from '@angular/core';
import {Coordinate} from '../../map/models/map.model';
import {randomLocalCoordinates} from '../../../utils/randomCoordinates';
import {v4 as uuidv4} from 'uuid';
import {random} from 'lodash';
import {AirTrackEntity} from '../air-track.models';

@Injectable({
  providedIn: 'root'
})
export class AirTrackService {
  private colorsNumber = 10;
  private jetTypes = 3;

  createAirTracks(amount: string): AirTrackEntity[] {
    return randomLocalCoordinates(parseInt(amount)).map((coordinate) => {
      return this.getEntity(coordinate);
    })
  }

  updateAirTracks(ids: string[]): AirTrackEntity[] {
    return randomLocalCoordinates(ids.length)
      .map((coordinate, index) => {
      return this.getEntity(coordinate, ids[index]);
    })
  }

  updateNonMapProperties(entities: AirTrackEntity[]): AirTrackEntity[] {
    return entities.map(entity => {
      const newEntity = this.getEntity(entity.coordinate, entity.id);
      return {
        ...entity,
        from: newEntity.from,
        to: newEntity.to,
        firePower: newEntity.firePower
      }
    })
  }

  private getEntity(coordinate: Coordinate, id: string = uuidv4()): AirTrackEntity {
    const fromValues = ['israel', 'neverland', 'narnia', 'duckland', 'kansas'];
    const toValues = ['dreamland', 'disneyland', 'euroland', 'someotherland']
    return {
      id,
      coordinate,
      someOtherPropertyToCalculateColor: random(0, this.colorsNumber),
      name: random(0, this.jetTypes),
      radius: random(100, 1000),
      from: fromValues[random(fromValues.length)],
      to: toValues[random(toValues.length)],
      firePower: random(0, 10),
    }
  }
}
