import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { BackendService, UnitMetadata } from '../backend.service';
import { MainDatastoreService } from '../../maindatastore.service';
import { DatastoreService } from '../datastore.service';

export interface UnitExtendedData {
  id: number;
  key: string;
  label: string;
  disabled: boolean;
}

@Component({
  templateUrl: './export-unit.component.html',
  styles: [
    '.disabled-element {color: gray}',
    '.tcMessage {font-style: italic; font-size: smaller}'
  ]
})
export class ExportUnitComponent implements OnInit {
  dataLoading = false;
  objectsDatasource: MatTableDataSource<UnitExtendedData>;
  displayedColumns = ['selectCheckbox', 'name'];
  tableSelectionCheckbox = new SelectionModel <UnitExtendedData>(true, []);
  addTestcenterFiles = false;
  unitsWithPlayer: number[] = [];
  usedPlayers: string[] = [];

  constructor(
    private fb: FormBuilder,
    private mds: MainDatastoreService,
    public ds: DatastoreService,
    private bs: BackendService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.tableSelectionCheckbox.clear();
    this.objectsDatasource = new MatTableDataSource(this.ds.unitList.map(
      ud => <UnitExtendedData>{
        id: ud.id,
        key: ud.key,
        label: ud.label,
        disabled: false
      }
    ));
  }

  isAllSelected(): boolean {
    const numSelected = this.tableSelectionCheckbox.selected.length;
    let numRows = 0;
    this.objectsDatasource.data.forEach(ud => {
      if (!ud.disabled) numRows += 1;
    });
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.tableSelectionCheckbox.clear() :
      this.objectsDatasource.data.forEach(row => {
        if (!row.disabled) this.tableSelectionCheckbox.select(row);
      });
  }

  updateUnitList(): void {
    if (this.addTestcenterFiles) {
      if (this.unitsWithPlayer.length > 0) {
        this.objectsDatasource.data.forEach(ud => {
          ud.disabled = this.unitsWithPlayer.indexOf(ud.id) < 0;
        });
      } else {
        const getMetadataSubscriptions: Observable<UnitMetadata>[] = [];
        this.ds.unitList.forEach(
          ud => {
            getMetadataSubscriptions.push(this.bs.getUnitMetadata(this.ds.selectedWorkspace, ud.id));
          }
        );
        forkJoin(getMetadataSubscriptions)
          .subscribe((allMetadata: UnitMetadata[]) => {
            this.unitsWithPlayer = [];
            this.usedPlayers = [];
            allMetadata.forEach(umd => {
              if (umd.playerid) {
                const validPlayerId = DatastoreService.validModuleId(umd.playerid, this.ds.playerList);
                if (validPlayerId !== false) {
                  this.unitsWithPlayer.push(umd.id);
                  const playerIdToAdd = validPlayerId === true ? umd.playerid : validPlayerId;
                  if (this.usedPlayers.indexOf(playerIdToAdd) < 0) this.usedPlayers.push(playerIdToAdd);
                }
              }
            });
            this.objectsDatasource.data.forEach(ud => {
              ud.disabled = this.unitsWithPlayer.indexOf(ud.id) < 0;
            });
          });
      }
    } else {
      this.objectsDatasource.data.forEach(ud => {
        ud.disabled = false;
      });
    }
  }
}
