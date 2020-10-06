import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizeIFrameChildDirective } from './resize-IFrameChild/resize-IFrameChild.directive';

import { PreviewRoutingModule } from './preview-routing.module';
import { PreviewComponent } from './preview.component';
import { PreviewActivateGuard } from './preview-routing';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatDialogModule} from "@angular/material/dialog";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatButtonModule,
    HttpClientModule,
    MatDialogModule,
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
