import * as Cesium from 'cesium';
import {MAP_LAYERS} from '../map.model';

export interface ICesiumPointPrimitiveOptions {
  id: { id: string; layerType: MAP_LAYERS };
  position: Cesium.Cartesian3;
  color?: Cesium.Color;
  show?: boolean;
  pixelSize?: number;
  outlineColor?: Cesium.Color;
  outlineWidth?: number;
}
