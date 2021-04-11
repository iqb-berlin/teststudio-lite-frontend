import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthoringComponent } from './authoring.component';
import { UnitComponent } from './unit/unit.component';

const routes: Routes = [
  {
    path: 'a/:ws',
    component: AuthoringComponent,
    children: [
      {
        path: 'u/:u',
        component: UnitComponent
        // canActivate: [UnitDesignActivateGuard],
        // canDeactivate: [UnitDesignDeactivateGuard],
        // resolve: {
        //   unitDesignData: UnitDesignResolver
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthoringRoutingModule { }
