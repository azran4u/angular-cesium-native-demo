import * as Cesium from 'cesium';
import {MAP_LAYERS} from '../map.model';

export interface ICesiumLabelOptions {
  id: { id: string; layerType: MAP_LAYERS };
  text: string;
  position: Cesium.Cartesian3;
  show?: boolean;
  font?: string;
  fillColor?: Cesium.Color;
  outlineColor?: Cesium.Color;
  outlineWidth?: number;
  showBackground?: boolean;
  backgroundColor?: Cesium.Color;
  backgroundPadding?: Cesium.Cartesian2;
  style?: Cesium.LabelStyle;
  pixelOffset?: Cesium.Cartesian2;
  eyeOffset?: Cesium.Cartesian3;
  horizontalOrigin?: Cesium.HorizontalOrigin;
  verticalOrigin?: Cesium.VerticalOrigin;
  scale?: number;
  translucencyByDistance?: Cesium.NearFarScalar;
  pixelOffsetScaleByDistance?: Cesium.NearFarScalar;
  heightReference?: Cesium.HeightReference;
  distanceDisplayCondition?: Cesium.DistanceDisplayCondition;
}
