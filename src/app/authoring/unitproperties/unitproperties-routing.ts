// eslint-disable-next-line max-classes-per-file
import { Injectable } from '@angular/core';
import {
  CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve
} from '@angular/router';
import { Observable } from 'rxjs';
import { DatastoreService, SaveDataComponent } from '../datastore.service';
import { MainDatastoreService } from '../../maindatastore.service';
import { BackendService, UnitProperties } from '../backend.service';

@Injectable()
export class UnitPropertiesActivateGuard implements CanActivate {
  // eslint-disable-next-line class-methods-use-this
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log('UnitPropertiesActivateGuard');
    return true;
  }
}

@Injectable()
export class UnitPropertiesDeactivateGuard implements CanDeactivate<SaveDataComponent> {
  // eslint-disable-next-line class-methods-use-this
  canDeactivate(
    component: SaveDataComponent,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component.saveOrDiscard();
  }
}

@Injectable()
// enriches the routing data with unit data:
// places in data['unitProperties'] the unit object
export class UnitPropertiesResolver implements Resolve<UnitProperties | number> {
  constructor(
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    private bs: BackendService
  ) { }

  resolve(next: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<UnitProperties | number> {
    if ((next.params.u === null) || (next.params.u === 0) || (next.params.u === '0')) {
      return null; // no unit-data
    }
    if (this.mds.loginStatus) {
      return this.bs.getUnitProperties(
        this.ds.selectedWorkspace,
        next.params.u
      );
    }
    return null;
  }
}

export const routingUnitPropertiesProviders = [UnitPropertiesActivateGuard, UnitPropertiesDeactivateGuard, UnitPropertiesResolver];
