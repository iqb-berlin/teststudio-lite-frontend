import { IqbCommonModule } from '../iqb-common';
import { NgModule } from '@angular/core';
import { IqbFileShortUploadComponent } from './iqbFileShortUpload/iqbFileShortUpload.component';
import { IqbFileShortUploadQueueComponent } from './iqbFileShortUploadQueue/iqbFileShortUploadQueue.component';
import { IqbFileShortUploadInputForDirective } from './iqbFileShortUploadInputFor/iqbFileShortUploadInputFor.directive';

import { MatProgressBarModule, MatCardModule, MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatCardModule,
    HttpClientModule,
    IqbCommonModule,
    CommonModule
  ],
  declarations: [
    IqbFileShortUploadComponent,
    IqbFileShortUploadQueueComponent,
    IqbFileShortUploadInputForDirective
  ],
  exports: [
    IqbFileShortUploadQueueComponent,
    IqbFileShortUploadInputForDirective,
  ]
})
export class IqbFilesShortModule { }
