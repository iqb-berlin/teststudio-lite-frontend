import { routingUnitResponsesProviders } from './unitresponses/unitresponses-routing';
import { AuthoringDashboardComponent } from './dashboard/dashboard.component';
import { routingUnitPropertiesProviders } from './unitproperties/unitproperties-routing';
import { MatTableModule, MatTabsModule, MatButtonModule, MatIconModule, MatToolbarModule,
  MatCheckboxModule, MatSortModule, MatDialogModule, MatTooltipModule, MatSnackBarModule,
  MatSelectModule, MatListModule, MatSlideToggleModule, MatButtonToggleModule, MatChipsModule,
  MatMenuModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatCardModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ResizeIFrameChildDirective } from './resize-IFrameChild/resize-IFrameChild.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthoringRoutingModule } from './authoring-routing.module';
import { AuthoringComponent } from './authoring.component';
import { UnitDesignComponent } from './unitdesign/unitdesign.component';
import { UnitPropertiesComponent } from './unitproperties/unitproperties.component';
import { NewunitComponent } from './newunit/newunit.component';
import { routingUnitDesignProviders } from './unitdesign/unitdesign-routing';
import { SelectAuthoringToolComponent } from './select-authoring-tool/select-authoring-tool.component';
import { UnitResponsesComponent } from './unitresponses/unitresponses.component';
import { SelectUnitComponent } from './select-unit/select-unit.component';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { MoveUnitComponent } from './moveunit/moveunit.component';

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
    MatCardModule,
    MatSnackBarModule,
    MatTableModule,
    MatCheckboxModule,
    ScrollDispatchModule
  ],
  declarations: [
    AuthoringComponent,
    ResizeIFrameChildDirective,
    UnitDesignComponent,
    UnitPropertiesComponent,
    NewunitComponent,
    AuthoringDashboardComponent,
    SelectAuthoringToolComponent,
    UnitResponsesComponent,
    SelectUnitComponent,
    MoveUnitComponent
  ],
  exports: [
    AuthoringComponent,
    AuthoringDashboardComponent
  ],
  entryComponents: [
    NewunitComponent,
    SelectAuthoringToolComponent,
    SelectUnitComponent,
    MoveUnitComponent
  ],
  providers: [
    routingUnitPropertiesProviders,
    routingUnitDesignProviders,
    routingUnitResponsesProviders
  ]
})
export class AuthoringModule { }
