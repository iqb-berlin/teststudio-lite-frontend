import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { BackendService, UnitProperties } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {
  selectedWorkspace = 0;
  selectedUnit$ = new BehaviorSubject<number>(0);
  unitMetadata: { [unitId: number]: UnitProperties } = {};
  unitMetaDataChanged = false;
  unitDefinition: { [unitId: number]: string } = {};
  unitDefinitionChanged = false;

  constructor(private bs: BackendService) {}

  saveUnitData(unitId: number): void {
    if (this.unitMetaDataChanged && this.unitMetadata[unitId]) {
      const myMetadata = this.unitMetadata[unitId];
      this.bs.setUnitMetaData(
        this.selectedWorkspace,
        myMetadata.id, myMetadata.key, myMetadata.label, myMetadata.description
      ).subscribe(result => {
        if (result === true) {
          this.unitMetaDataChanged = false;
        } else {
          console.error('changeUnitProperties failed');
        }
      });
    }
    if (this.unitDefinitionChanged && this.unitDefinition[unitId]) {
      this.bs.setUnitDefinition(
        this.selectedWorkspace,
        unitId,
        this.unitDefinition[unitId],
        this.unitMetadata[unitId].playerid
      ).subscribe(saveResult => {
        const myreturn = (typeof saveResult === 'boolean') ? saveResult : false;
        if (myreturn) {
          this.unitDefinitionChanged = false;
        }
      });
    }
  }
}
