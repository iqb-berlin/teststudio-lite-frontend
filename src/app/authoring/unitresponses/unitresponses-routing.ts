import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable, of } from 'rxjs';
import {MessageDialogComponent} from "iqb-components";


@Injectable()
export class UnitResponsesActivateGuard implements CanActivate {
  constructor(
    private selectResponseHandlerDialog: MatDialog
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
          switchMap(() => {
            return of(false);
          })
        );
      }
  }
}

export const routingUnitResponsesProviders = [UnitResponsesActivateGuard];
