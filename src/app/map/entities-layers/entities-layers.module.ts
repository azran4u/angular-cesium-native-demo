import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { ClosedAreaMapEffects } from './entities/closed-areas/closed-area.map.effects';
import { AirTrackMapEffects } from './entities/air-tracks/air-track.map.effects';
import { TargetMapEffects } from './entities/targets/targets.map.effects';
import { ComponentMapEffects } from './entities/components/components.map.effects';
import { RouteMapEffects } from './entities/routes/routes.map.effects';
import { PesahMapEffects } from './entities/pesah/pesah.map.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forFeature([
      ClosedAreaMapEffects,
      AirTrackMapEffects,
      TargetMapEffects,
      ComponentMapEffects,
      RouteMapEffects,
      PesahMapEffects,
    ]),
  ],
})
export class EntitiesLayersModule {}
