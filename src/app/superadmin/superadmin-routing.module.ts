import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemauthoringComponent } from './itemauthoring/itemauthoring.component';
import { ItemplayerComponent } from './itemplayer/itemplayer.component';
import { WorkspacesComponent } from './workspaces/workspaces.component';
import { UsersComponent } from './users/users.component';
import { SuperadminComponent } from './superadmin.component';

const routes: Routes = [
  {
    path: 'super-admin',
    component: SuperadminComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UsersComponent },
      { path: 'workspaces', component: WorkspacesComponent },
      { path: 'editors', component: ItemauthoringComponent },
      { path: 'players', component: ItemplayerComponent },
      { path: '**', component: ItemauthoringComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperadminRoutingModule { }
