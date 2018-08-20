import { DatastoreService } from './../datastore.service';
import { MainDatastoreService } from './../../maindatastore.service';
import { UnitDesignComponent } from './Unitdesign.component';
import { BackendService, ServerError, UnitDesignData } from './../backend.service';
import { Injectable, Component } from '@angular/core';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable()
export class UnitDesignActivateGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      console.log('UnitdesignActivateGuard');
    return true;
  }
}

@Injectable()
export class UnitDesignDeactivateGuard implements CanDeactivate<UnitDesignComponent> {
  canDeactivate(
    component: UnitDesignComponent,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      console.log('UnitdesignDeactivateGuard');
    return true;
  }
}

@Injectable()
// enriches the routing data with unit data:
// places in data['Unitdesign'] the unit object
export class UnitDesignResolver implements Resolve<UnitDesignData | ServerError> {
  constructor(
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    private bs: BackendService) { }

  resolve(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<UnitDesignData | ServerError> {
      this.ds.unitViewMode$.next('ud');
      if (this.mds.isLoggedIn$.getValue() === true) {
        return this.bs.getUnitDesignData(
              this.mds.token$.getValue(),
              this.ds.workspaceId$.getValue(),
              next.params['u']);
      } else {
        return null;
      }
    }
}


export const routingUnitdesignProviders = [UnitDesignActivateGuard, UnitDesignDeactivateGuard, UnitDesignResolver];
