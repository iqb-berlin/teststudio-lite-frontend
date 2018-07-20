import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemmodulesComponent } from './itemmodules/itemmodules.component';
import { WorkspacesComponent } from './workspaces/workspaces.component';
import { UsersComponent } from './users/users.component';
import { SuperadminComponent } from './superadmin.component';


const routes: Routes = [
  {
    path: 'superadmin',
    component: SuperadminComponent,
    children: [
      {path: '', redirectTo: 'users', pathMatch: 'full'},
      {path: 'users', component: UsersComponent},
      {path: 'itemmodules', component: ItemmodulesComponent},
      {path: 'workspaces', component: WorkspacesComponent},
      {path: '**', component: UsersComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperadminRoutingModule { }
