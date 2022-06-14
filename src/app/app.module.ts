import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CesiumDirective } from './cesium.directive';
import { MapService } from './map.service';
import { MapComponent } from './map/map.component';
import { SampleComponent } from './sample/sample.component';

@NgModule({
  declarations: [AppComponent, CesiumDirective, MapComponent, SampleComponent],
  imports: [BrowserModule],
  providers: [MapService],
  bootstrap: [AppComponent],
})
export class AppModule {}
