import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizeIFrameChildDirective } from './resize-IFrameChild/resize-IFrameChild.directive';

import { PreviewRoutingModule } from './preview-routing.module';
import { PreviewComponent } from './preview.component';
import { PreviewActivateGuard } from './preview-routing';
import { MatProgressSpinnerModule, MatTooltipModule, MatButtonModule, MatSnackBarModule } from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatButtonModule,
    PreviewRoutingModule,
    FlexLayoutModule
  ],
  declarations: [
    PreviewComponent,
    ResizeIFrameChildDirective
  ],
  providers: [
    PreviewActivateGuard
  ]
})
export class PreviewModule { }
