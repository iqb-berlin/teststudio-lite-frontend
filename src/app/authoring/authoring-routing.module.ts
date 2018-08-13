import { UnitComponent } from './unit/unit.component';
import { AuthoringComponent } from './authoring.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'a',
    component: AuthoringComponent,
    children: [
      {path: 'u/:u',
        component: UnitComponent
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthoringRoutingModule { }
