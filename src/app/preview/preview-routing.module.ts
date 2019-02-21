import { PreviewComponent } from './preview.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreviewActivateGuard } from './preview-routing';

const routes: Routes = [
  {
    path: 'p/:u',
    component: PreviewComponent,
    canActivate: [PreviewActivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreviewRoutingModule { }


