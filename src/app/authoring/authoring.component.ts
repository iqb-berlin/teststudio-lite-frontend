import { SelectionModel } from '@angular/cdk/collections';
import { RouterTestingModule } from '@angular/router/testing';
import { SelectUnitComponent } from './select-unit/select-unit.component';
import { SelectAuthoringToolComponent } from './select-authoring-tool/select-authoring-tool.component';
import { Router, ActivatedRoute, Resolve } from '@angular/router';
import { NewunitComponent } from './newunit/newunit.component';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatSnackBar, MatChipList, MatChipListChange, MatChipSelectionChange } from '@angular/material';
import { MainDatastoreService } from './../maindatastore.service';
import { BehaviorSubject } from 'rxjs';
import { UnitShortData, BackendService, WorkspaceData } from './backend.service';
import { DatastoreService, UnitViewMode, SaveDataComponent } from './datastore.service';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './authoring.component.html',
  styleUrls: ['./authoring.component.css']
})
export class AuthoringComponent implements OnInit {
  private dataLoading = false;
  private unitList$ = new BehaviorSubject<UnitShortData[]>([]);
  private workspaceList: WorkspaceData[] = [];
  private disableSaveButton = true;
  private disablePreviewButton = true;


  // private wsSelector = new FormControl();
  private unitSelector = new FormControl();
  private unitviewSelector = new FormControl();
  private unitViewModes: UnitViewMode[] = [];

  constructor(
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    private bs: BackendService,
    private newunitDialog: MatDialog,
    private selectUnitDialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.ds.workspaceList$.subscribe(wsList => this.workspaceList = wsList);
    this.ds.workspaceId$.subscribe(wsint => {
      this.updateUnitList();
      // this.wsSelector.setValue(wsint, {emitEvent: false});
    });
    this.ds.selectedUnitId$.subscribe(id => this.disablePreviewButton = id === 0);
    this.unitViewModes = this.ds.unitViewModes;
    this.ds.unitViewMode$.subscribe(uvm => {
      this.unitviewSelector.setValue(uvm, {emitEvent: false});
    });
    this.ds.unitDesignToSave$.subscribe(c =>
      this.disableSaveButton = (c == null) && (this.ds.unitPropertiesToSave$.getValue() == null));
    this.ds.unitPropertiesToSave$.subscribe(c =>
      this.disableSaveButton = (c == null) && (this.ds.unitDesignToSave$.getValue() == null));
  }

  ngOnInit() {
    this.ds.selectedUnitId$.subscribe((uId: number) => {
      this.unitSelector.setValue(uId, {emitEvent: false});
    });

    this.unitSelector.valueChanges.subscribe(uId => {
      this.router.navigate([this.ds.unitViewMode$.getValue() + '/' + uId], {relativeTo: this.route})
        .then(naviresult => {
          if (naviresult === false) {
            this.unitSelector.setValue(this.ds.selectedUnitId$.getValue(), {emitEvent: false});
          }
        });
    });

    this.unitviewSelector.valueChanges.subscribe(uvm => {
      this.router.navigate([uvm + '/' + this.ds.selectedUnitId$.getValue()], {relativeTo: this.route})
        .then(naviresult => {
          if (naviresult === false) {
            this.unitviewSelector.setValue(this.ds.unitViewMode$.getValue(), {emitEvent: false});
          }
      });
    });
  }

  updateUnitList() {
    const myToken = this.mds.token$.getValue();
    const myWorkspace = this.ds.workspaceId$.getValue();
    if ((myToken === '') || (myWorkspace === 0)) {
      this.unitList$.next([]);
      // this.unitId$.next(0);
    } else {
      this.dataLoading = true;
      this.bs.getUnitList(myToken, myWorkspace).subscribe(
        (uresponse: UnitShortData[]) => {
          this.dataLoading = false;
          this.unitList$.next(uresponse);
      });
    }
  }

  // HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
  addUnit() {
    const dialogRef = this.newunitDialog.open(NewunitComponent, {
      width: '600px',
      data: {
        key: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        if (result !== false) {
          this.dataLoading = true;
          this.bs.addUnit(
              this.mds.token$.getValue(),
              this.ds.workspaceId$.getValue(),
              (<FormGroup>result).get('key').value,
              (<FormGroup>result).get('label').value).subscribe(
                respOk => {
                  if (respOk) {
                    this.snackBar.open('Aufgabe hinzugefügt', '', {duration: 1000});
                    this.updateUnitList();
                  } else {
                    this.snackBar.open('Konnte Aufgabe nicht hinzufügen', 'Fehler', {duration: 1000});
                  }
                  this.dataLoading = false;
                });
        }
      }
    });
  }

  deleteUnit() {
    const dialogRef = this.selectUnitDialog.open(SelectUnitComponent, {
      width: '400px',
      height: '700px',
      data: {
        title: 'Aufgabe(n) löschen',
        buttonlabel: 'Löschen'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        if (result !== false) {
          this.bs.deleteUnits(
            this.mds.token$.getValue(),
            this.ds.workspaceId$.getValue(),
            (result as UnitShortData[]).map(ud => ud.id)).subscribe(
              ok => {
                if (ok) {
                  this.updateUnitList();
                  this.snackBar.open('Aufgabe(n) gelöscht', '', {duration: 1000});
                }
              });
        }
      }
    });
  }

  saveUnit() {
    let componentToSaveData: SaveDataComponent = this.ds.unitPropertiesToSave$.getValue();
    if (componentToSaveData !== null) {
      componentToSaveData.saveData().subscribe(result => {
        if (result) {
          this.snackBar.open('Aufgabe gespeichert', '', {duration: 1000});
        }
      });
    }
    componentToSaveData = this.ds.unitDesignToSave$.getValue();
    if (componentToSaveData !== null) {
      componentToSaveData.saveData().subscribe(result => {
        if (result) {
          this.snackBar.open('Aufgabe gespeichert', '', {duration: 1000});
        }
      });
    }
  }

  previewUnit() {
    this.router.navigate(['p/' + this.ds.workspaceId$.getValue() + '##' + this.ds.selectedUnitId$.getValue()]);
  }
}
