import * as Cesium from 'cesium';
import {MAP_LAYERS} from '../map.model';

export interface ICesiumBillboardOptions {
  id: { id: string; layerType: MAP_LAYERS };
  image: string;
  color?: Cesium.Color;
  show?: boolean
  position: Cesium.Cartesian3;
  pixelOffset?: Cesium.Cartesian2;
  eyeOffset?: Cesium.Cartesian3;
  heightReference?: Cesium.HeightReference;
  horizontalOrigin?: Cesium.HorizontalOrigin;
  verticalOrigin?: Cesium.VerticalOrigin;
  scale?: number;
  imageSubRegion?: { id: string; subRegion: Cesium.BoundingRectangle };
  rotation?: number;
  alignedAxis?: Cesium.Cartesian3;
  width?: number;
  height?: number;
  scaleByDistance?: Cesium.NearFarScalar;
  translucencyByDistance?: Cesium.NearFarScalar;
  pixelOffsetScaleByDistance?: Cesium.NearFarScalar;
  sizeInMeters?: boolean;
  distanceDisplayCondition?: Cesium.DistanceDisplayCondition;
}
