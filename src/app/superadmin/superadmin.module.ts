import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTabsModule, MatButtonModule, MatIconModule, MatToolbarModule,
  MatCheckboxModule, MatSortModule, MatDialogModule, MatTooltipModule, MatSnackBarModule, MatCardModule,
  MatSelectModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
  import {FlexLayoutModule} from '@angular/flex-layout';
  import { ReactiveFormsModule } from '@angular/forms';

import { SuperadminRoutingModule } from './superadmin-routing.module';
import { WorkspacesComponent } from './workspaces/workspaces.component';
import { UsersComponent } from './users/users.component';
import { ItemauthoringComponent } from './itemauthoring/itemauthoring.component';
import { ItemplayerComponent } from './itemplayer/itemplayer.component';
import { SuperadminComponent } from './superadmin.component';
import { DatastoreService } from './datastore.service';
import { BackendService } from './backend.service';
import { IqbFilesModule } from '../iqb-files/iqb-files.module';
import { IqbCommonModule } from '../iqb-common/iqb-common.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewuserComponent } from './users/newuser/newuser.component';
import { NewpasswordComponent } from './users/newpassword/newpassword.component';
import { NewworkspaceComponent } from './workspaces/newworkspace/newworkspace.component';
import { EditworkspaceComponent } from './workspaces/editworkspace/editworkspace.component';


@NgModule({
  imports: [
    CommonModule,
    SuperadminRoutingModule,
    IqbFilesModule,
    IqbCommonModule,
    MatTableModule,
    MatTabsModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSortModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatSnackBarModule,
    FlexLayoutModule
  ],
  exports: [
    SuperadminComponent,
    DashboardComponent
  ],
  declarations: [
    WorkspacesComponent,
    UsersComponent,
    ItemauthoringComponent,
    ItemplayerComponent,
    SuperadminComponent,
    DashboardComponent,
    NewuserComponent,
    NewpasswordComponent,
    NewworkspaceComponent,
    EditworkspaceComponent
  ],
  providers: [
    BackendService,
    DatastoreService
  ],
  entryComponents: [
    NewuserComponent,
    NewpasswordComponent,
    NewworkspaceComponent,
    EditworkspaceComponent
  ]
})
export class SuperadminModule { }
