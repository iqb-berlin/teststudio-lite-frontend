import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { MainDatastoreService } from '../maindatastore.service';
import {
  UnitShortData, BackendService, UnitProperties
} from './backend.service';
import { DatastoreService, UnitViewMode, SaveDataComponent } from './datastore.service';

import { NewunitComponent } from './newunit/newunit.component';
import { SelectUnitComponent } from './select-unit/select-unit.component';
import { MoveUnitComponent } from './moveunit/moveunit.component';

@Component({
  templateUrl: './authoring.component.html',
  styleUrls: ['./authoring.component.css']
})
export class AuthoringComponent implements OnInit, OnDestroy {
  private routingSubscription: Subscription = null;
  private selectedUnitSubscription: Subscription = null;
  dataLoading = false;
  unitList: UnitShortData[] = [];
  selectedUnits: string[] = [];

  private _disablePreviewButton = true;
  get disablePreviewButton() {
    return this._disablePreviewButton;
  }

  private _disableSaveButton = true;
  get disableSaveButton() {
    return this._disableSaveButton;
  }

  // private wsSelector = new FormControl();
  unitSelector = new FormControl();
  unitviewSelector = new FormControl();
  unitViewModes: UnitViewMode[] = [];

  constructor(
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    private bs: BackendService,
    private newunitDialog: MatDialog,
    private selectUnitDialog: MatDialog,
    private messsageDialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.ds.unitList$.subscribe(ul => {
      this.unitList = ul;
    });
    this.unitViewModes = this.ds.unitViewModes;
    this.ds.unitViewMode$.subscribe(uvm => {
      this.unitviewSelector.setValue(uvm, { emitEvent: false });
    });
    this.ds.unitDesignToSave$.subscribe(c => {
      this._disableSaveButton = (c == null) && (this.ds.unitPropertiesToSave$.getValue() == null);
      if (this._disableSaveButton) {
        this.dataLoading = false;
      }
    });
    this.ds.unitPropertiesToSave$.subscribe(c => {
      this._disableSaveButton = (c == null) && (this.ds.unitDesignToSave$.getValue() == null);
      if (this._disableSaveButton) {
        this.dataLoading = false;
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.routingSubscription = this.route.params.subscribe(params => {
        let selectedWorkspaceName = '';
        if (this.mds.loginStatus) {
          const workspaceRoute = Number(params.ws);
          this.mds.loginStatus.workspaces.forEach(ws => {
            if (ws.id === workspaceRoute) {
              selectedWorkspaceName = ws.name;
              this.ds.selectedWorkspace = workspaceRoute;
            }
          });
        }
        if (selectedWorkspaceName) {
          this.mds.pageTitle = `IQB-Teststudio - ${selectedWorkspaceName}`;
          this.updateUnitList();
        } else {
          this.ds.selectedWorkspace = 0;
          this.unitList = [];
        }
      });
    });
    /*
    this.selectedUnitSubscription = this.ds.selectedUnit$.subscribe((uId: number) => {
      // todo häh?
      this.unitSelector.setValue(uId, { emitEvent: false });
    });

    this.unitSelector.valueChanges.subscribe(uId => {
      this.router.navigate([`${this.ds.unitViewMode$.getValue()}/${uId}`], { relativeTo: this.route })
        .then(naviresult => {
          if (naviresult === false) {
            this.unitSelector.setValue(this.ds.selectedUnitId$.getValue(), { emitEvent: false });
          }
        });
    });

    this.unitviewSelector.valueChanges.subscribe(uvm => {
      this.router.navigate([`${uvm}/${this.ds.selectedUnitId$.getValue()}`], { relativeTo: this.route })
        .then(naviresult => {
          if (naviresult === false) {
            this.unitviewSelector.setValue(this.ds.unitViewMode$.getValue(), { emitEvent: false });
          }
        });
    });
     */
  }

  updateUnitList(): void {
    this.bs.getUnitList(this.ds.selectedWorkspace).subscribe(
      uResponse => {
        if (typeof uResponse === 'number') {
          this.mds.errorMessage = MainDatastoreService.serverErrorMessageText(uResponse);
          this.unitList = [];
          this.ds.selectedUnit$.next(0);
        } else {
          this.unitList = uResponse;
          const selectedUnit = this.ds.selectedUnit$.getValue();
          let unitExists = false;
          this.unitList.forEach(u => {
            if (u.id === selectedUnit) {
              unitExists = true;
            }
          });
          this.ds.selectedUnit$.next(unitExists ? selectedUnit : 0);
        }
      }
    );
  }

  onUnitSelectionChange(event: Event): void {
    console.info('l8\tListSelectionExample::onNgModelChange::selectedOptions:', this.selectedUnits, ';');
  }

  addUnit(): void {
    const dialogRef = this.newunitDialog.open(NewunitComponent, {
      width: '600px',
      data: {
        title: 'Neue Aufgabe',
        key: '',
        label: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        if (result !== false) {
          this.dataLoading = true;
          this.bs.addUnit(
            this.ds.selectedWorkspace,
            (<FormGroup>result).get('key').value,
            (<FormGroup>result).get('label').value
          ).subscribe(
            respOk => {
              // todo db-error?
              if (respOk) {
                this.snackBar.open('Aufgabe hinzugefügt', '', { duration: 1000 });
                this.updateUnitList();
                this.router.navigate(['a/']);
              } else {
                this.snackBar.open('Konnte Aufgabe nicht hinzufügen', 'Fehler', { duration: 1000 });
              }
              this.dataLoading = false;
            }
          );
        }
      }
    });
  }

  deleteUnit(): void {
    const dialogRef = this.selectUnitDialog.open(SelectUnitComponent, {
      width: '400px',
      height: '700px',
      data: {
        title: 'Aufgabe(n) löschen',
        buttonLabel: 'Löschen'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        if (result !== false) {
          this.bs.deleteUnits(
            this.ds.selectedWorkspace,
            (result as UnitShortData[]).map(ud => ud.id)
          ).subscribe(
            ok => {
              // todo db-error?
              if (ok) {
                this.updateUnitList();
                this.snackBar.open('Aufgabe(n) gelöscht', '', { duration: 1000 });
              }
            }
          );
        }
      }
    });
  }

  moveUnit(): void {
    const dialogRef = this.selectUnitDialog.open(MoveUnitComponent, {
      width: '400px',
      height: '700px',
      data: {
        title: 'Aufgabe(n) verschieben',
        buttonLabel: 'Verschieben',
        currentWorkspaceId: this.ds.selectedWorkspace
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        if (result !== false) {
          const dialogComponent = dialogRef.componentInstance;
          const wsSelected = dialogComponent.selectform.get('wsSelector');
          if (wsSelected) {
            this.bs.moveUnits(
              this.ds.selectedWorkspace,
              (dialogComponent.tableselectionCheckbox.selected as UnitShortData[]).map(ud => ud.id),
              wsSelected.value
            ).subscribe(
              ok => {
                // todo db-error?
                if (ok) {
                  this.updateUnitList();
                  this.snackBar.open('Aufgabe(n) verschoben', '', { duration: 1000 });
                }
              }
            );
          }
        }
      }
    });
  }

  // HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
  saveUnit(): void {
    let componentToSaveData: SaveDataComponent = this.ds.unitPropertiesToSave$.getValue();
    if (componentToSaveData !== null) {
      this.dataLoading = true;
      componentToSaveData.saveData().subscribe(result => {
        if (result) {
          this.updateUnitList();
        }
      });
    }
    componentToSaveData = this.ds.unitDesignToSave$.getValue();
    if (componentToSaveData !== null) {
      this.dataLoading = true;
      componentToSaveData.saveData().subscribe();
    }
  }

  previewUnit(): void {
    this.router.navigate([`p/${this.ds.selectedWorkspace}##${this.ds.selectedUnit$.getValue()}`]);
  }

  copyUnit(): void {
    const myUnitId = this.ds.selectedUnit$.getValue();
    if (myUnitId > 0) {
      this.bs.getUnitProperties(
        this.ds.selectedWorkspace,
        myUnitId
      ).subscribe(up => {
        if (up !== null) {
          const newUnit = up as UnitProperties;
          if (newUnit.id === myUnitId) {
            const dialogRef = this.newunitDialog.open(NewunitComponent, {
              width: '600px',
              data: {
                title: `Aufgabe ${newUnit.key} in neue Aufgabe kopieren`,
                key: newUnit.key,
                label: newUnit.label
              }
            });

            dialogRef.afterClosed().subscribe(result => {
              if (typeof result !== 'undefined') {
                if (result !== false) {
                  this.dataLoading = true;
                  this.bs.copyUnit(
                    this.ds.selectedWorkspace,
                    myUnitId,
                    (<FormGroup>result).get('key').value,
                    (<FormGroup>result).get('label').value
                  ).subscribe(
                    respOk => {
                      // todo db-error?
                      if (respOk) {
                        this.snackBar.open('Aufgabe hinzugefügt', '', { duration: 1000 });
                        this.updateUnitList();
                        // todo select new unit
                      } else {
                        this.snackBar.open('Konnte Aufgabe nicht hinzufügen', 'Fehler', { duration: 1000 });
                      }
                      this.dataLoading = false;
                    }
                  );
                }
              }
            });
          }
        }
      });
    } else {
      this.snackBar.open('Bitte erst Aufgabe auswählen', 'Hinweis', { duration: 3000 });
    }
  }

  importUnit(): void {
    this.snackBar.open('Funktion ist deaktiviert', '', { duration: 1000 });
  }

  exportUnit(): void {
    const dialogRef = this.selectUnitDialog.open(SelectUnitComponent, {
      width: '400px',
      height: '700px',
      data: {
        title: 'Aufgabe(n) als Datei speichern',
        buttonlabel: 'Download'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        if (result !== false) {
          this.bs.downloadUnits(
            this.ds.selectedWorkspace,
            (result as UnitShortData[]).map(ud => ud.id)
          ).subscribe(
            (binaryData: Blob) => {
              // todo db-error?
              // const file = new File(binaryData, 'unitDefs.voud.zip', {type: 'application/zip'});
              saveAs(binaryData, 'unitDefs.voud.zip');
              this.snackBar.open('Aufgabe(n) gespeichert', '', { duration: 1000 });
            }
          );
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routingSubscription !== null) {
      this.routingSubscription.unsubscribe();
    }
    if (this.selectedUnitSubscription !== null) {
      this.selectedUnitSubscription.unsubscribe();
    }
  }
}
