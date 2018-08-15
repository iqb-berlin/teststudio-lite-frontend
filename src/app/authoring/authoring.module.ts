import { MatTableModule, MatTabsModule, MatButtonModule, MatIconModule, MatToolbarModule,
  MatCheckboxModule, MatSortModule, MatDialogModule, MatTooltipModule, MatSnackBarModule,
  MatSelectModule, MatListModule, MatSlideToggleModule, MatButtonToggleModule, MatChipsModule,
  MatMenuModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ResizeIFrameChildDirective } from './resize-IFrameChild/resize-IFrameChild.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthoringRoutingModule } from './authoring-routing.module';
import { AuthoringComponent } from './authoring.component';
import { UnitdesignComponent } from './unitdesign/unitdesign.component';
import { UnitpropertiesComponent } from './unitproperties/unitproperties.component';
import { NewunitComponent } from './newunit/newunit.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    FlexLayoutModule,
    AuthoringRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatListModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSnackBarModule
  ],
  declarations: [
    AuthoringComponent,
    ResizeIFrameChildDirective,
    UnitdesignComponent,
    UnitpropertiesComponent,
    NewunitComponent
  ],
  exports: [
    AuthoringComponent
  ],
  entryComponents: [
    NewunitComponent
  ]
})
export class AuthoringModule { }
