import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EntitiesLayersModule} from './entities-layers/entities-layers.module';
import {CesiumDirective} from './directives/cesium.directive';
import {MapComponent} from './map.component';
import {StatesModule} from './states/states.module';


@NgModule({
  declarations: [CesiumDirective, MapComponent],
  exports: [
    MapComponent
  ],
  imports: [
    CommonModule,
    EntitiesLayersModule,
    StatesModule
  ]
})
export class MapModule {
}
