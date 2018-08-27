import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizeIFrameChildDirective } from './resize-IFrameChild/resize-IFrameChild.directive';

import { PreviewRoutingModule } from './preview-routing.module';
import { PreviewComponent } from './preview.component';

@NgModule({
  imports: [
    CommonModule,
    PreviewRoutingModule
  ],
  declarations: [
    PreviewComponent,
    ResizeIFrameChildDirective
  ]
})
export class PreviewModule { }
