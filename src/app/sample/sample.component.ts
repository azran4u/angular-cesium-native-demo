import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import * as Cesium from 'cesium';
import { Coordinate, MAP_LAYERS } from '../map.model';
import * as turf from '@turf/turf';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss'],
})
export class SampleComponent implements OnInit {
  private entities: Cesium.Entity[] = [];
  private layer = MAP_LAYERS.POLYGON_LAYER;

  constructor(private mapService: MapService) {}

  async ngOnInit() {
    Promise.all(
      Object.values(MAP_LAYERS).map(async (layer) => {
        await this.mapService.createLayer(layer);
      })
    );
    this.mapService.mouseHover();
  }

  async polygon_layer_add() {
    this.entities = this.createAirPlanes();
    this.mapService.upsertEntitiesToLayer(this.layer, this.entities, []);
    this.polygon_layer_show();
    await this.polygon_layer_focus();
  }

  polygon_layer_remove() {
    this.mapService.upsertEntitiesToLayer(this.layer, [], this.entities);
  }

  polygon_layer_hide() {
    this.mapService.hideLayer(this.layer);
  }

  polygon_layer_show() {
    this.mapService.showLayer(this.layer);
  }

  async polygon_layer_focus() {
    if (this.entities[0]) {
      await this.mapService.flyTo(this.entities[0]);
    } else {
      console.log(`entities are empty`);
    }
  }

  createAirPlanes() {
    return turf
      .randomPoint(10, {
        bbox: turf.bbox(
          turf.lineString([
            [32, 31],
            [36, 35],
          ])
        ),
      })
      .features.map(
        (feature) =>
          new Cesium.Entity({
            position: this.coordinateToCesiumPosition({
              latitude: feature.geometry.coordinates[0],
              longitude: feature.geometry.coordinates[1],
            }),
            billboard: {
              image: '../../assets/fighter-jet.png', // default: undefined
              // width: 100,
              // height: 100,
              // sizeInMeters: true,
              color: Cesium.Color.RED,
              scale: 0.1,
              scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0),
            },
          })
      );
  }

  createPolygon() {
    return new Cesium.Entity({
      polygon: {
        hierarchy: {
          holes: [],
          positions: Cesium.Cartesian3.fromDegreesArray([
            -109.080842, 45.002073, -105.91517, 45.002073, -104.058488,
            44.996596, -104.053011, 43.002989, -104.053011, 41.003906,
            -105.728954, 40.998429, -107.919731, 41.003906, -109.04798,
            40.998429, -111.047063, 40.998429, -111.047063, 42.000709,
            -111.047063, 44.476286, -111.05254, 45.002073,
          ]),
        },
        height: 0,
        material: Cesium.Color.RED.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.BLACK,
      },
    });
  }

  coordinateToCesiumPosition(coordinate: Coordinate) {
    return new Cesium.ConstantPositionProperty(
      Cesium.Cartesian3.fromDegrees(coordinate.latitude, coordinate.longitude)
    );
  }
}
