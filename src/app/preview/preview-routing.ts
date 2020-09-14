import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { BackendService } from './backend.service';
import { MessageDialogComponent } from './../iqb-common/message-dialog/message-dialog.component';
import { MainDatastoreService } from './../maindatastore.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';


@Injectable()
export class PreviewActivateGuard implements CanActivate {
  constructor(
    private mds: MainDatastoreService,
    private bs: BackendService,
    private sorryDialog: MatDialog,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (next.params['u'] === null) {
        return false; // no unit-data
      } else {
        const pSplits = next.params['u'].split('##');
        if (pSplits.length !== 2) {
          return false; // no unit-data
        } else {
          return this.bs.hasValidItemplayer(pSplits[1])
          .pipe(
            switchMap(hasTool => {
              if (hasTool === true) {
                return of(true);
              } else {
                const dialogRef = this.sorryDialog.open(MessageDialogComponent, {
                  width: '400px',
                  data: {
                    content: 'Es ist kein Itemplayer-Modul für diese Aufgabe verfügbar.',
                    closebuttonlabel: 'Schließen'
                  }
                });
                return dialogRef.afterClosed().pipe(
                  switchMap(dialogResult => {
                    return of(false);
                  })
                );
              }
            })
          );
        }
      }
  }
}
