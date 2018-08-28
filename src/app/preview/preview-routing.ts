import { MatDialog } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { BackendService } from './backend.service';
import { PreviewComponent } from './preview.component';
import { MessageDialogComponent } from './../iqb-common/message-dialog/message-dialog.component';
import { MainDatastoreService } from './../maindatastore.service';
import { Injectable, Component } from '@angular/core';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
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
                this.mds.showNaviButtons$.next(true);
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

@Injectable()
export class PreviewDeactivateGuard implements CanDeactivate<PreviewComponent> {
  constructor(
    private mds: MainDatastoreService
  ) {}

  canDeactivate(
    component: PreviewComponent,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    this.mds.showNaviButtons$.next(false);
    return true;
  }
}

export const routingPreviewProviders = [PreviewActivateGuard, PreviewDeactivateGuard];
