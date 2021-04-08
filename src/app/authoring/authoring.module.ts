import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { ResizeIFrameChildDirective } from './resize-IFrameChild/resize-IFrameChild.directive';

import { AuthoringRoutingModule } from './authoring-routing.module';
import { AuthoringComponent } from './authoring.component';
import { UnitDesignComponent } from './unitdesign/unitdesign.component';
import { UnitPropertiesComponent } from './unitproperties/unitproperties.component';
import { NewunitComponent } from './newunit/newunit.component';
import { routingUnitDesignProviders } from './unitdesign/unitdesign-routing';
import { SelectAuthoringToolComponent } from './select-authoring-tool/select-authoring-tool.component';
import { SelectUnitComponent } from './select-unit/select-unit.component';
import { MoveUnitComponent } from './moveunit/moveunit.component';
import { routingUnitPropertiesProviders } from './unitproperties/unitproperties-routing';
import { UnitComponent } from './unit/unit.component';
import { UnitMetadataComponent } from './unit/unit-metadata/unit-metadata.component';
import { UnitEditorComponent } from './unit/unit-editor/unit-editor.component';

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
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    MatTableModule,
    MatCheckboxModule,
    FormsModule,
    MatTabsModule
  ],
  declarations: [
    AuthoringComponent,
    ResizeIFrameChildDirective,
    UnitDesignComponent,
    UnitPropertiesComponent,
    NewunitComponent,
    SelectAuthoringToolComponent,
    SelectUnitComponent,
    MoveUnitComponent,
    UnitComponent,
    UnitMetadataComponent,
    UnitEditorComponent
  ],
  exports: [
    AuthoringComponent
  ],
  entryComponents: [
    NewunitComponent,
    SelectAuthoringToolComponent,
    SelectUnitComponent,
    MoveUnitComponent
  ],
  providers: [
    routingUnitPropertiesProviders,
    routingUnitDesignProviders
  ]
})
export class AuthoringModule { }
