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
import { DatastoreService } from './datastore.service';

import { NewunitComponent } from './newunit/newunit.component';
import { SelectUnitComponent } from './select-unit/select-unit.component';
import { MoveUnitComponent } from './moveunit/moveunit.component';
import { WorkspaceData } from '../backend.service';

@Component({
  templateUrl: './authoring.component.html',
  styleUrls: ['./authoring.component.css']
})
export class AuthoringComponent implements OnInit, OnDestroy {
  dataLoading = false;
  unitList: UnitShortData[] = [];
  private routingSubscription: Subscription = null;
  private selectedUnitSubscription: Subscription = null;
  selectedUnits: string[] = [];

  constructor(
    private mds: MainDatastoreService,
    public ds: DatastoreService,
    private bs: BackendService,
    private newunitDialog: MatDialog,
    private selectUnitDialog: MatDialog,
    private messsageDialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.routingSubscription = this.route.params.subscribe(params => {
        const workspaceRoute = Number(params.ws);
        this.ds.selectedWorkspace = workspaceRoute;
        let selectedWorkspaceName = '';
        if (this.mds.loginStatus) {
          this.mds.loginStatus.workspaces.forEach(ws => {
            if (ws.id === workspaceRoute) {
              selectedWorkspaceName = ws.name;
            }
          });
        }
        this.updateUnitList();
        this.mds.pageTitle = `IQB-Teststudio - ${selectedWorkspaceName}`;
      });
    });
    this.selectedUnitSubscription = this.ds.selectedUnit$.subscribe((uId: number) => {
      if (uId > 0) {
        if (this.selectedUnits.length > 0) {
          const unitId = Number(this.selectedUnits[0]);
          if (unitId !== uId) {
            this.selectedUnits = [uId.toString()];
          }
        } else {
          this.selectedUnits = [uId.toString()];
        }
      } else {
        this.selectedUnits = [];
      }
    });

    /*
    this.unitSelector.valueChanges.subscribe(uId => {
      this.router.navigate([`${this.ds.unitViewMode$.getValue()}/${uId}`], { relativeTo: this.route })
        .then(naviresult => {
          if (naviresult === false) {
            this.unitSelector.setValue(this.ds.selectedUnitId$.getValue(), { emitEvent: false });
          }
        });
    });
     */

    /*
    this.unitviewSelector.valueChanges.subscribe(uvm => {
      console.log(uvm);
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
    if (this.selectedUnits.length > 0) {
      const unitId = this.selectedUnits[0];
      this.router.navigate([`u/${unitId}`], { relativeTo: this.route });
    }
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
                // this.router.navigate(['a/']);
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

  saveUnitData(): void {
    this.ds.saveUnitData(this.ds.selectedUnit$.getValue());
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
