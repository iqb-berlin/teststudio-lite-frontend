import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { UnitComponent } from './unit.component';
import { ConfirmDialogData, SaveOrDiscardComponent } from '../save-or-discard/save-or-discard.component';
import { DatastoreService } from '../datastore.service';

@Injectable()
export class UnitRoutingCanDeactivateGuard implements CanDeactivate<UnitComponent> {
  constructor(
    public confirmDialog: MatDialog,
    public ds: DatastoreService
  ) { }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.ds.unitDataChanged) {
      const dialogRef = this.confirmDialog.open(SaveOrDiscardComponent, {
        width: '500px',
        height: '300px',
        data: <ConfirmDialogData> {
          title: 'Speichern',
          content: 'Sie haben Daten dieser Aufgabe geändert. Möchten Sie diese Änderungen speichern?',
          confirmButtonLabel: 'Speichern',
          confirmButtonReturn: 'YES',
          confirmButton2Label: 'Änderungen verwerfen',
          confirmButton2Return: 'NO'
        }
      });
      return dialogRef.afterClosed().pipe(
        switchMap(result => {
          if (result === false) {
            return of(false);
          }
          if (result === 'NO') {
            return of(true);
          } // 'YES'
          return this.ds.saveUnitData();
        })
      );
    }
    return of(true);
  }
}
