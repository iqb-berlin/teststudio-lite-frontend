import { AboutComponent } from './about/about.component';
import { PreviewComponent } from './preview';
import { AuthoringComponent } from './authoring';
import { SuperadminComponent } from './superadmin';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'super-admin', component: SuperadminComponent},
  {path: 'a', component: AuthoringComponent},
  {path: 'p', component: PreviewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
