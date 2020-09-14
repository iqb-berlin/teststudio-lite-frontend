import { MessageDialogComponent } from './../../iqb-common/message-dialog/message-dialog.component';
import { MainDatastoreService } from './../../maindatastore.service';
import { switchMap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Injectable, Component } from '@angular/core';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';


@Injectable()
export class UnitResponsesActivateGuard implements CanActivate {
  constructor(
    private selectResponseHandlerDialog: MatDialog,
    private mds: MainDatastoreService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      console.log('UnitResponsesActivateGuard');
      if ((next.params['u'] === null) || (next.params['u'] === 0) || (next.params['u'] === '0')) {
        return false; // no unit-data
      } else {
        const dialogRef = this.selectResponseHandlerDialog.open(MessageDialogComponent, {
          width: '400px',
          data: {
            content: 'Es sind derzeit keine Module für die Antwortverarbeitung verfügbar.',
            closebuttonlabel: 'Schließen'
          }
        });
        return dialogRef.afterClosed().pipe(
          switchMap(dialogResult => {
            return of(false);
          })
        );
      }
  }
}

export const routingUnitResponsesProviders = [UnitResponsesActivateGuard];
