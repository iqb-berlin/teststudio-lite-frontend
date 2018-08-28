import { switchMap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { SelectAuthoringToolComponent } from './../select-authoring-tool/select-authoring-tool.component';
import { MatDialog } from '@angular/material';
import { DatastoreService, SaveDataComponent } from './../datastore.service';
import { MainDatastoreService } from './../../maindatastore.service';
import { BackendService, ServerError, UnitDesignData } from './../backend.service';
import { Injectable, Component } from '@angular/core';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';


@Injectable()
export class UnitDesignActivateGuard implements CanActivate {
  constructor(
    private selectAuthoringToolDialog: MatDialog,
    private bs: BackendService,
    private ds: DatastoreService,
    private mds: MainDatastoreService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if ((next.params['u'] === null) || (next.params['u'] === 0) || (next.params['u'] === '0')) {
        return false; // no unit-data
      } else {
        return this.bs.hasValidAuthoringTool(next.params['u'])
        .pipe(
          switchMap(hasTool => {
            if (hasTool === true) {
              return of(true);
            } else {
              const dialogRef = this.selectAuthoringToolDialog.open(SelectAuthoringToolComponent, {
                width: '400px',
                data: {
                  prompt: 'Für diese Aufgabe ist bisher kein Autorenmodul festgelegt. Bitte wählen Sie aus der Liste ein Modul aus!'
                }
              });
              return dialogRef.afterClosed().pipe(
                switchMap(dialogResult => {
                  if (dialogResult !== false) {
                    return this.bs.setUnitAuthoringTool(
                      this.mds.token$.getValue(),
                      this.ds.workspaceId$.getValue(),
                      next.params['u'],
                      (<FormGroup>dialogResult).get('atSelector').value).pipe(
                        switchMap(setResult => {
                          const r = setResult === true;
                          return of(r);
                        })
                      );
                  } else {
                    return of(false);
                  }
                })
              );
            }
          })
        );
      }
  }
}

@Injectable()
export class UnitDesignDeactivateGuard implements CanDeactivate<SaveDataComponent> {
  canDeactivate(
    component: SaveDataComponent,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return component.saveOrDiscard();
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
      if ((next.params['u'] === null) || (next.params['u'] === 0) || (next.params['u'] === '0')) {
        return null; // no unit-data
      } else {
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
}


export const routingUnitDesignProviders = [UnitDesignActivateGuard, UnitDesignDeactivateGuard, UnitDesignResolver];
