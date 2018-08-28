import { DatastoreService, SaveDataComponent } from './../datastore.service';
import { MainDatastoreService } from './../../maindatastore.service';
import { BackendService, ServerError, UnitProperties } from './../backend.service';
import { Injectable, Component } from '@angular/core';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable()
export class UnitPropertiesActivateGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      console.log('UnitPropertiesActivateGuard');
    return true;
  }
}

@Injectable()
export class UnitPropertiesDeactivateGuard implements CanDeactivate<SaveDataComponent> {
  canDeactivate(
    component: SaveDataComponent,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return component.saveOrDiscard();
  }
}

@Injectable()
// enriches the routing data with unit data:
// places in data['unitProperties'] the unit object
export class UnitPropertiesResolver implements Resolve<UnitProperties | ServerError> {
  constructor(
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    private bs: BackendService) { }

  resolve(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<UnitProperties | ServerError> {
      this.ds.unitViewMode$.next('up');
      if ((next.params['u'] === null) || (next.params['u'] === 0) || (next.params['u'] === '0')) {
        return null; // no unit-data
      } else {
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
}


export const routingUnitPropertiesProviders = [UnitPropertiesActivateGuard, UnitPropertiesDeactivateGuard, UnitPropertiesResolver];
