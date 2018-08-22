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
  private unitId$ = new BehaviorSubject<number>(0);
  private unitList$ = new BehaviorSubject<UnitShortData[]>([]);
  private workspaceList: WorkspaceData[] = [];
  private workspaceId = 0;
  private disableSaveButton = true;


  // private wsSelector = new FormControl();
  private unitSelector = new FormControl();
  private unitviewSelector = new FormControl();
  private unitViewModes: UnitViewMode[] = [];

  constructor(
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    private bs: BackendService,
    private newunitDialog: MatDialog,
    private deleteunitDialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.ds.workspaceList$.subscribe(wsList => this.workspaceList = wsList);
    this.ds.workspaceId$.subscribe(wsint => {
      this.workspaceId = wsint;
      this.updateUnitList();
      // this.wsSelector.setValue(wsint, {emitEvent: false});
    });
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
    /*
    this.wsSelector.valueChanges
      .subscribe(wsId => {
        this.ds.workspaceId$.next(wsId);
    });
    */
    this.unitId$.subscribe((uId: number) => {
      this.unitSelector.setValue(uId, {emitEvent: false});
      this.router.navigate([this.ds.unitViewMode$.getValue() + '/' + uId], {relativeTo: this.route});
    });

    this.unitSelector.valueChanges
      .subscribe(uId => {
        this.unitId$.next(uId);
    });

    this.unitviewSelector.valueChanges
      .subscribe(uvm => {
        this.ds.unitViewMode$.next(uvm);
        this.router.navigate([uvm + '/' + this.unitId$.getValue()], {relativeTo: this.route});
      });
  }

  updateUnitList() {
    const myToken = this.mds.token$.getValue();
    const myWorkspace = this.ds.workspaceId$.getValue();
    if ((myToken === '') || (myWorkspace === 0)) {
      this.unitList$.next([]);
      this.unitId$.next(0);
    } else {
      this.dataLoading = true;
      this.bs.getUnitList(myToken, myWorkspace).subscribe(
        (uresponse: UnitShortData[]) => {
          this.dataLoading = false;
          this.unitList$.next(uresponse);
          const uIdStr = localStorage.getItem('u');
          if (uIdStr == null) {
            this.unitId$.next(0);
          } else {
            const uId = +uIdStr;
            if (uId > 0) {
              let uFound = false;
              for (let i = 0; i < uresponse.length; i++) {
                if (uresponse[i].id === uId) {
                  this.unitId$.next(uId);
                  uFound = true;
                  break;
                }
              }

              if (!uFound) {
                this.unitId$.next(0);
              }
            } else {
              this.unitId$.next(0);
            }
          }
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
              this.workspaceId,
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
    console.log('tbd');
  }

  saveUnit() {
    let componentToSaveData: SaveDataComponent = this.ds.unitPropertiesToSave$.getValue();
    if (componentToSaveData !== null) {
      componentToSaveData.saveData().subscribe(result => {
        if (result) {
          this.snackBar.open('Aufgabe gepeichert', '', {duration: 1000});
        }
      });
    }
    componentToSaveData = this.ds.unitDesignToSave$.getValue();
    if (componentToSaveData !== null) {
      componentToSaveData.saveData().subscribe(result => {
        if (result) {
          this.snackBar.open('Aufgabe gepeichert', '', {duration: 1000});
        }
      });
    }
  }
}
