import { DatastoreService } from './../datastore.service';
import { MainDatastoreService } from './../../maindatastore.service';
import { UnitpropertiesComponent } from './unitproperties.component';
import { BackendService, ServerError, UnitProperties } from './../backend.service';
import { Injectable, Component } from '@angular/core';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable()
export class UnitpropertiesActivateGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      console.log('UnitpropertiesActivateGuard');
    return true;
  }
}

@Injectable()
export class UnitpropertiesDeactivateGuard implements CanDeactivate<UnitpropertiesComponent> {
  canDeactivate(
    component: UnitpropertiesComponent,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      console.log('UnitpropertiesDeactivateGuard');
    return true;
  }
}

@Injectable()
// enriches the routing data with unit data:
// places in data['unitProperties'] the unit object
export class UnitpropertiesResolver implements Resolve<UnitProperties | ServerError> {
  constructor(
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    private bs: BackendService) { }

  resolve(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<UnitProperties | ServerError> {
      this.ds.unitViewMode$.next('up');
      if (this.mds.isLoggedIn$.getValue() === true) {
        return this.bs.getUnitProperties(
              this.mds.token$.getValue(),
              this.ds.workspaceId$.getValue(),
              next.params['u']);
      } else {
        return null;
      }
    }
}


export const routingUnitpropertiesProviders = [UnitpropertiesActivateGuard, UnitpropertiesDeactivateGuard, UnitpropertiesResolver];
