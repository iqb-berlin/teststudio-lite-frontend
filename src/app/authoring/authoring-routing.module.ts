import { UnitpropertiesComponent } from './unitproperties/unitproperties.component';
import { UnitdesignComponent } from './unitdesign/unitdesign.component';
import { AuthoringComponent } from './authoring.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'a',
    component: AuthoringComponent,
    children: [
      {path: 'ud/:u', component: UnitdesignComponent},
      {path: 'up/:u', component: UnitpropertiesComponent}
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthoringRoutingModule { }
