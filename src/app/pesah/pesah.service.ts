import { Injectable } from '@angular/core';
import { randomLocalCoordinates } from 'src/utils/randomCoordinates';
import { Coordinate } from '../map/models/map.model';
import { OperationalStatus, PesahEntity } from './pesah.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class PesahService {
  createPesah(amount: string): PesahEntity[] {
    return randomLocalCoordinates(parseInt(amount)).map((coordinate) => {
      return this.getEntity(coordinate);
    });
  }

  updatePesah(ids: string[]): PesahEntity[] {
    return randomLocalCoordinates(ids.length).map((coordinate, index) => {
      return this.getEntity(coordinate, ids[index]);
    });
  }

  private getEntity(
    coordinate: Coordinate,
    id: string = uuidv4()
  ): PesahEntity {
    return {
      id,
      coordinate,
      name: 'Name',
      radius: 30000,
      color: '#FF0000',
      operationalStatus:
        Math.random() > 0.5 ? OperationalStatus.HOT : OperationalStatus.COLD,
    };
  }
}
