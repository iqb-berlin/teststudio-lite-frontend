import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { BackendService, StrIdLabelSelectedData, UnitProperties } from './backend.service';
import { UnitData } from './authoring.classes';

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
  editorList: StrIdLabelSelectedData[] = [];
  playerList: StrIdLabelSelectedData[] = [];
  unitDataOld: UnitData = null;
  unitDataNew: UnitData = null;
  unitDataChanged = false;

  constructor(private bs: BackendService) {}

  saveUnitData(unitId: number): boolean {
    if (this.unitMetaDataChanged && this.unitMetadata[unitId]) {
      const myMetadata = this.unitMetadata[unitId];
      this.bs.setUnitMetaData(
        this.selectedWorkspace,
        myMetadata.id, myMetadata.key, myMetadata.label, myMetadata.description
      ).subscribe(result => {
        if (result === true) {
          this.unitMetaDataChanged = false;
          return true;
        }
        return false;
        console.error('changeUnitProperties failed');
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
          return true;
        }
        return false;
      });
    }
    return true;
  }

  setUnitDataChanged() {
    this.unitDataChanged = this.getUnitDataChanged();
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
