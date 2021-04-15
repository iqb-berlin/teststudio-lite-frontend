import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Component, Inject, OnDestroy, OnInit
} from '@angular/core';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from 'iqb-components';
import { MainDatastoreService } from '../maindatastore.service';
import { BackendService, UnitShortData } from './backend.service';
import { DatastoreService } from './datastore.service';

import { NewunitComponent } from './dialogs/newunit.component';
import { SelectUnitComponent } from './dialogs/select-unit.component';
import { MoveUnitComponent } from './dialogs/moveunit.component';
import { BackendService as SuperAdminBackendService } from '../superadmin/backend.service';

@Component({
  templateUrl: './authoring.component.html',
  styleUrls: ['./authoring.component.css']
})
export class AuthoringComponent implements OnInit, OnDestroy {
  dataLoading = false;
  private routingSubscription: Subscription = null;
  private selectedUnitSubscription: Subscription = null;
  selectedUnits: string[] = [];
  uploadUrl = '';
  token = '';
  uploadProcessId = '';

  constructor(
    @Inject('SERVER_URL') private serverUrl: string,
    private mds: MainDatastoreService,
    public ds: DatastoreService,
    private bs: BackendService,
    private bsSuper: SuperAdminBackendService,
    private newUnitDialog: MatDialog,
    private selectUnitDialog: MatDialog,
    private messsageDialog: MatDialog,
    private deleteConfirmDialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.uploadUrl = `${this.serverUrl}php_authoring/uploadUnitFile.php`;
    this.token = localStorage.getItem('t');
    this.uploadProcessId = Math.floor(Math.random() * 20000000 + 10000000).toString();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.routingSubscription = this.route.params.subscribe(params => {
        this.ds.selectedWorkspace = Number(params.ws);
        this.ds.selectedUnit$.next(0);
        this.updateUnitList();
      });
    });
  }

  updateUnitList(): void {
    this.bs.getUnitList(this.ds.selectedWorkspace).subscribe(
      uResponse => {
        this.ds.unitList = uResponse;
        const selectedUnit = this.ds.selectedUnit$.getValue();
        let unitExists = false;
        this.ds.unitList.forEach(u => {
          if (u.id === selectedUnit) {
            unitExists = true;
          }
        });
        this.ds.selectedUnit$.next(unitExists ? selectedUnit : 0);
        this.bs.getEditorList().subscribe(atL => {
          this.ds.editorList = atL;
          let selectedWorkspaceName = '';
          if (this.mds.loginStatus) {
            this.mds.loginStatus.workspaces.forEach(ws => {
              if (ws.id === this.ds.selectedWorkspace) {
                selectedWorkspaceName = ws.name;
              }
            });
          }
          this.mds.pageTitle = `IQB-Teststudio ${selectedWorkspaceName ? (` - ${selectedWorkspaceName}`) : ''}`;
        },
        () => {
          this.ds.editorList = [];
        });
        this.bsSuper.getItemPlayerFiles().subscribe(
          fileDataResponse => {
            fileDataResponse.forEach(f => {
              const fnSplits = f.filename.split('.');
              this.ds.playerList.push({
                id: fnSplits[0],
                label: fnSplits[0],
                html: ''
              });
            });
          },
          () => {
            this.ds.playerList = [];
          }
        );
      },
      err => {
        this.mds.errorMessage = err.msg();
        this.ds.unitList = [];
        this.ds.selectedUnit$.next(0);
        this.mds.pageTitle = 'IQB-Teststudio - Problem beim Laden der Aufgabenliste';
      }
    );
  }

  onUnitSelectionChange(): void {
    if (this.selectedUnits.length > 0) {
      const unitId = this.selectedUnits[0];
      this.selectedUnits = [];
      this.router.navigate([`u/${unitId}`], { relativeTo: this.route });
    }
  }

  addUnit(): void {
    const dialogRef = this.newUnitDialog.open(NewunitComponent, {
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
            (<FormGroup>result).get('key').value.trim(),
            (<FormGroup>result).get('label').value
          ).subscribe(
            respOk => {
              if (respOk) {
                this.snackBar.open('Aufgabe hinzugefügt', '', { duration: 1000 });
                this.updateUnitList();
                // this.router.navigate(['a/']);
              } else {
                this.snackBar.open('Konnte Aufgabe nicht hinzufügen', 'Fehler', { duration: 3000 });
              }
              this.dataLoading = false;
            },
            err => {
              this.snackBar.open(`Konnte Aufgabe nicht hinzufügen (${err.code})`, 'Fehler', { duration: 3000 });
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
              } else {
                this.snackBar.open('Konnte Aufgabe(n) nicht löschen.', 'Fehler', { duration: 3000 });
                this.dataLoading = false;
              }
            },
            err => {
              this.snackBar.open(`Konnte Aufgabe(n) nicht löschen (${err.code})`, 'Fehler', { duration: 3000 });
              this.dataLoading = false;
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
          const wsSelected = dialogComponent.selectForm.get('wsSelector');
          if (wsSelected) {
            this.bs.moveUnits(
              this.ds.selectedWorkspace,
              (dialogComponent.tableSelectionCheckbox.selected as UnitShortData[]).map(ud => ud.id),
              wsSelected.value
            ).subscribe(
              moveResponse => {
                if (typeof moveResponse === 'number') {
                  this.snackBar.open(`Es konnte(n) ${moveResponse} Aufgabe(n) nicht verschoben werden.`,
                    'Fehler', { duration: 3000 });
                } else {
                  this.snackBar.open('Aufgabe(n) verschoben', '', { duration: 1000 });
                }
                this.updateUnitList();
              },
              err => {
                this.snackBar.open(`Konnte Aufgabe nicht verschieben (${err.code})`, 'Fehler', { duration: 3000 });
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
      ).subscribe(
        newUnit => {
          if (newUnit.id === myUnitId) {
            const dialogRef = this.newUnitDialog.open(NewunitComponent, {
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
                        this.selectedUnits = [];
                      } else {
                        this.snackBar.open('Konnte Aufgabe nicht hinzufügen', 'Fehler', { duration: 3000 });
                      }
                      this.dataLoading = false;
                    },
                    err => {
                      this.snackBar.open(`Konnte Aufgabe nicht hinzufügen (${err.msg()})`,
                        'Fehler', { duration: 3000 });
                      this.dataLoading = false;
                    }
                  );
                }
              }
            });
          }
        },
        err => {
          this.snackBar.open(`Fehler beim Laden der Aufgabeneigenschaften (${err.msg()})`,
            'Fehler', { duration: 3000 });
          this.dataLoading = false;
        }
      );
    } else {
      this.snackBar.open('Bitte erst Aufgabe auswählen', 'Hinweis', { duration: 3000 });
    }
  }

  exportUnit(): void {
    const dialogRef = this.selectUnitDialog.open(SelectUnitComponent, {
      width: '400px',
      height: '700px',
      data: {
        title: 'Aufgabe(n) als Datei speichern',
        buttonLabel: 'Download'
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
    this.ds.saveUnitData().subscribe(saveResult => {
      if (saveResult === true) {
        this.snackBar.open('Änderungen an Aufgabedaten gespeichert', '', { duration: 1000 });
      } else {
        this.snackBar.open('Problem: Konnte Aufgabendaten nicht speichern', '', { duration: 3000 });
      }
    });
  }

  finishUnitUpload() : void {
    this.uploadProcessId = Math.floor(Math.random() * 20000000 + 10000000).toString();
    this.snackBar.open('Dateien wurden an den Server gesendet - bitte warten', '', { duration: 3000 });
  }

  discardChanges(): void {
    const dialogRef = this.deleteConfirmDialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: <ConfirmDialogData>{
        title: 'Verwerfen der Änderungen',
        content: 'Die Änderungen an der Aufgabe werden verworfen. Fortsetzen?',
        confirmbuttonlabel: 'Verwerfen',
        showcancel: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
        this.ds.unitDataNew = {
          id: this.ds.unitDataOld.id,
          key: this.ds.unitDataOld.key,
          label: this.ds.unitDataOld.label,
          description: this.ds.unitDataOld.description,
          editorId: this.ds.unitDataOld.editorId,
          playerId: this.ds.unitDataOld.playerId,
          lastChangedStr: this.ds.unitDataOld.lastChangedStr,
          def: this.ds.unitDataOld.def
        };
        this.ds.unitDataChanged = false;
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
