import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTabsModule, MatButtonModule, MatIconModule, MatToolbarModule,
  MatCheckboxModule, MatSortModule, MatDialogModule, MatTooltipModule, MatSnackBarModule,
  MatSelectModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

import { SuperadminRoutingModule } from './superadmin-routing.module';
import { WorkspacesComponent } from './workspaces/workspaces.component';
import { UsersComponent } from './users/users.component';
import { ItemmodulesComponent } from './itemmodules/itemmodules.component';
import { SuperadminComponent } from './superadmin.component';
import { DatastoreService } from './datastore.service';
import { BackendService } from './backend.service';
import { IqbFilesModule } from './../iqb-files/iqb-files.module';
import { IqbCommonModule } from './../iqb-common/iqb-common.module';
import { DashboardComponent } from './dashboard/dashboard.component';


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
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatSnackBarModule
  ],
  exports: [
    SuperadminComponent,
    DashboardComponent
  ],
  declarations: [
    WorkspacesComponent,
    UsersComponent,
    ItemmodulesComponent,
    SuperadminComponent,
    DashboardComponent],
  providers: [
    BackendService,
    DatastoreService
  ]
})
export class SuperadminModule { }
