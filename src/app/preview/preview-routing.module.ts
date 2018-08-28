import { PreviewComponent } from './preview.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreviewActivateGuard, PreviewDeactivateGuard } from './preview-routing';

const routes: Routes = [
  {
    path: 'p/:u',
    component: PreviewComponent,
    canActivate: [PreviewActivateGuard],
    canDeactivate: [PreviewDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreviewRoutingModule { }


