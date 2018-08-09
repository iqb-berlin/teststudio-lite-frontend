import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemauthoringComponent } from './itemauthoring/itemauthoring.component';
import { ItemplayerComponent } from './itemplayer/itemplayer.component';
import { WorkspacesComponent } from './workspaces/workspaces.component';
import { UsersComponent } from './users/users.component';
import { SuperadminComponent } from './superadmin.component';


const routes: Routes = [
  {
    path: 'superadmin',
    component: SuperadminComponent,
    children: [
      {path: '', redirectTo: 'itemauthoring', pathMatch: 'full'},
      {path: 'users', component: UsersComponent},
      {path: 'itemauthoring', component: ItemauthoringComponent},
      {path: 'itemplayer', component: ItemplayerComponent},
      {path: 'workspaces', component: WorkspacesComponent},
      {path: '**', component: ItemauthoringComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperadminRoutingModule { }
