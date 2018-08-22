import { UnitPropertiesActivateGuard,
  UnitPropertiesDeactivateGuard, UnitPropertiesResolver } from './unitproperties/unitproperties-routing';
import { UnitPropertiesComponent } from './unitproperties/unitproperties.component';
import { UnitDesignActivateGuard,
  UnitDesignDeactivateGuard, UnitDesignResolver } from './unitdesign/unitdesign-routing';
import { UnitDesignComponent } from './unitdesign/unitdesign.component';
import { AuthoringComponent } from './authoring.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'a',
    component: AuthoringComponent,
    children: [
      {path: 'ud/:u',
        component: UnitDesignComponent,
        // canActivate: [UnitActivateGuard],
        canDeactivate: [UnitDesignDeactivateGuard],
        resolve: {
          unitDesignData: UnitDesignResolver
        }
      },
      {path: 'up/:u',
        component: UnitPropertiesComponent,
        // canActivate: [UnitActivateGuard],
        canDeactivate: [UnitPropertiesDeactivateGuard],
        resolve: {
          unitProperties: UnitPropertiesResolver
        }
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthoringRoutingModule { }
