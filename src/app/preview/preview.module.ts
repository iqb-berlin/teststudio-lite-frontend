import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizeIFrameChildDirective } from './resize-IFrameChild/resize-IFrameChild.directive';

import { PreviewRoutingModule } from './preview-routing.module';
import { PreviewComponent } from './preview.component';
import { routingPreviewProviders } from './preview-routing';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    PreviewRoutingModule
  ],
  declarations: [
    PreviewComponent,
    ResizeIFrameChildDirective
  ],
  providers: [
    routingPreviewProviders
  ]
})
export class PreviewModule { }
