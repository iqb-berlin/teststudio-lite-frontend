import {
  BehaviorSubject, forkJoin, Observable, of
} from 'rxjs';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';
import { BackendService, StrIdLabelSelectedData, UnitShortData } from './backend.service';
import { UnitData } from './authoring.classes';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {
  selectedWorkspace = 0;
  selectedUnit$ = new BehaviorSubject<number>(0);
  editorList: StrIdLabelSelectedData[] = [];
  playerList: StrIdLabelSelectedData[] = [];
  unitDataOld: UnitData = null;
  unitDataNew: UnitData = null;
  unitDataChanged = false;
  unitList: UnitShortData[] = [];

  constructor(private bs: BackendService) {}

  saveUnitData(): Observable<boolean> {
    if (this.unitDataNew && this.unitDataOld) {
      const saveSubscriptions: Observable<number | boolean>[] = [];
      let reloadUnitList = false;
      if (
        (this.unitDataNew.key !== this.unitDataOld.key) ||
        (this.unitDataNew.label !== this.unitDataOld.label) ||
        (this.unitDataNew.description !== this.unitDataOld.description)
      ) {
        reloadUnitList = (this.unitDataNew.key !== this.unitDataOld.key) ||
          (this.unitDataNew.label !== this.unitDataOld.label);
        saveSubscriptions.push(this.bs.setUnitMetaData(
          this.selectedWorkspace,
          this.unitDataNew.id, this.unitDataNew.key, this.unitDataNew.label, this.unitDataNew.description
        ));
      }
      if (this.unitDataOld.editorId !== this.unitDataNew.editorId) {
        saveSubscriptions.push(this.bs.setUnitEditor(
          this.selectedWorkspace, this.unitDataNew.id, this.unitDataNew.editorId
        ));
      }
      if (this.unitDataOld.playerId !== this.unitDataNew.playerId) {
        saveSubscriptions.push(this.bs.setUnitPlayer(
          this.selectedWorkspace, this.unitDataNew.id, this.unitDataNew.playerId
        ));
      }
      // todo unit-def
      if (saveSubscriptions.length > 0) {
        return forkJoin(saveSubscriptions).pipe(
          switchMap(results => {
            let isFailing = false;
            results.forEach(r => {
              if (r !== true) isFailing = true;
            });
            if (isFailing) return of(false);
            this.unitDataOld = {
              id: this.unitDataNew.id,
              key: this.unitDataNew.key,
              label: this.unitDataNew.label,
              description: this.unitDataNew.description,
              editorId: this.unitDataNew.editorId,
              playerId: this.unitDataNew.playerId,
              lastChangedStr: this.unitDataNew.lastChangedStr,
              def: this.unitDataNew.def
            };
            this.unitDataChanged = false;
            if (reloadUnitList) {
              return this.bs.getUnitList(this.selectedWorkspace)
                .pipe(
                  map(uResponse => {
                    if (typeof uResponse === 'number') {
                      this.unitList = [];
                      return false;
                    }
                    this.unitList = uResponse;
                    return true;
                  })
                );
            }
            return of(true);
          })
        );
      }
      return of(true);
    }
    return of(true);
  }

  setUnitDataChanged(): void {
    this.unitDataChanged = this.getUnitDataChanged();
  }

  static unitKeyUniquenessValidator(unitId: number, unitList: UnitShortData[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const newKeyNormalised = control.value.toUpperCase().trim();
      let isUnique = true;
      unitList.forEach(u => {
        if (u.key.toUpperCase().trim() === newKeyNormalised && u.id !== unitId) {
          isUnique = false;
        }
      });
      if (!isUnique) {
        return { keyNotUnique: 'Der Kurzname muss eindeutig innerhalb des Arbeitsbereiches sein.' };
      }
      return null;
    };
  }

  private getUnitDataChanged(): boolean {
    if (this.unitDataOld && this.unitDataNew) {
      if (this.unitDataNew.key !== this.unitDataOld.key) return true;
      if (this.unitDataNew.label !== this.unitDataOld.label) return true;
      if (this.unitDataNew.description !== this.unitDataOld.description) return true;
      if (this.unitDataNew.editorId !== this.unitDataOld.editorId) return true;
      if (this.unitDataNew.playerId !== this.unitDataOld.playerId) return true;
      if (this.unitDataNew.def !== this.unitDataOld.def) return true;
    }
    return false;
  }
}
