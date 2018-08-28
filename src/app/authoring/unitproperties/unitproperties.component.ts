import { SelectAuthoringToolComponent } from './../select-authoring-tool/select-authoring-tool.component';
import { DatastoreService, SaveDataComponent } from './../datastore.service';
import { ConfirmDialogComponent, ConfirmDialogData } from './../../iqb-common/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { switchMap, map, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainDatastoreService } from './../../maindatastore.service';
import { BehaviorSubject, Subscriber, Subscription, Observable, of } from 'rxjs';
import { BackendService, UnitProperties, ServerError } from './../backend.service';
import { Component, OnInit, Pipe } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  templateUrl: './unitproperties.component.html',
  styleUrls: ['./unitproperties.component.css']
})
export class UnitPropertiesComponent implements OnInit, OnDestroy, SaveDataComponent {
  private routingSubscription: Subscription;
  private myUnitProps: UnitProperties = null;
  private unitpropsForm: FormGroup;
  public hasChanged$ = new BehaviorSubject<boolean>(false);

  constructor(
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    private bs: BackendService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public confirmDialog: MatDialog,
    public selectAuthoringToolDialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.unitpropsForm = this.fb.group({
      key: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      label: this.fb.control('')
    });

    this.routingSubscription = this.route.params.subscribe(
      params => {
        // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        const newUnit: UnitProperties | ServerError = this.route.snapshot.data['unitProperties'];

        this.hasChanged$.next(false);
        this.ds.unitPropertiesToSave$.next(null);
        this.ds.unitViewMode$.next('up');
        if (newUnit !== null) {
          if ((newUnit as UnitProperties).id !== undefined) {
            this.myUnitProps = newUnit as UnitProperties;
            this.unitpropsForm.setValue(
              {key: this.myUnitProps.key, label: this.myUnitProps.label},
              {emitEvent: false}
            );
          } else {
            this.myUnitProps = null;
            this.unitpropsForm.setValue(
              {key: '', label: ''},
              {emitEvent: false}
            );
          }
        } else {
          this.myUnitProps = null;
          this.unitpropsForm.setValue(
            {key: '', label: ''},
            {emitEvent: false}
          );
        }
        if (this.myUnitProps === null) {
          this.ds.updatePageTitle('Ändern Eigenschaften');
          this.ds.selectedUnitId$.next(0);
        } else {
          this.ds.updatePageTitle('Ändern Eigenschaften: ' + this.myUnitProps.key);
          this.ds.selectedUnitId$.next(this.myUnitProps.id);
        }
      });

    this.unitpropsForm.valueChanges.subscribe(val => {
      this.hasChanged$.next(true);
      this.ds.unitPropertiesToSave$.next(this);
    });
  }

  changeAuthoringTool() {
    const dialogRef = this.selectAuthoringToolDialog.open(SelectAuthoringToolComponent, {
      width: '400px',
      data: {
        authoringTool: this.myUnitProps.authoringtoolid,
        prompt: 'Zum Ändern des Autorenmoduls bitte unten auswählen!'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult !== false) {
        const myNewAuthoringTool = (<FormGroup>dialogResult).get('atSelector').value;
        this.bs.setUnitAuthoringTool(
          this.mds.token$.getValue(),
          this.ds.workspaceId$.getValue(),
          this.myUnitProps.id,
          myNewAuthoringTool).subscribe(setResult => {
            if (setResult === true) {
              this.myUnitProps.authoringtoolid = myNewAuthoringTool;
            }
          });
      }
    });
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  ngOnDestroy() {
    this.routingSubscription.unsubscribe();
  }

  saveOrDiscard(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.hasChanged$.getValue() === false) {
      return true;
    } else {
      if (this.unitpropsForm.invalid) {
        const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
          width: '500px',
          height: '300px',
          data:  <ConfirmDialogData>{
            title: 'Änderungen verwerfen?',
            content: 'Sie haben Daten dieser Aufgabe geändert, diese Änderungen sind aber ungültig und ' +
                'können nicht gespeichert werden. Möchten Sie diese Änderungen verwerfen?',
            confirmbuttonlabel: 'Änderungen verwerfen',
            confirmbuttonreturn: true
          }
        });
        return dialogRef.afterClosed().pipe(
          switchMap(result => {
              if (result === false) {
                return of(false);
              } else {
                return of(true);
              }
            }
        ));
      } else {
        const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
          width: '500px',
          height: '300px',
          data:  <ConfirmDialogData>{
            title: 'Speichern',
            content: 'Sie haben Daten dieser Aufgabe geändert. Möchten Sie diese Änderungen speichern?',
            confirmbuttonlabel: 'Speichern',
            confirmbuttonreturn: 'YES',
            confirmbutton2label: 'Änderungen verwerfen',
            confirmbutton2return: 'NO'
          }
        });
        return dialogRef.afterClosed().pipe(
          switchMap(result => {
              if (result === false) {
                return of(false);
              } else {
                if (result === 'NO') {
                  return of(true);
                } else { // 'YES'

                  return this.saveData();
                }
              }
            }
        ));
      }
    }
  }

  saveData(): Observable<boolean> {
    this.myUnitProps.key = this.unitpropsForm.get('key').value;
    this.myUnitProps.label = this.unitpropsForm.get('label').value;

    return this.bs.changeUnitProperties(
      this.mds.token$.getValue(),
      this.ds.workspaceId$.getValue(),
      this.myUnitProps)
    .pipe(
      map(saveResult => {
        const myreturn = (typeof saveResult === 'boolean') ? saveResult : false;
        if (myreturn) {
          this.hasChanged$.next(false);
          this.ds.unitPropertiesToSave$.next(null);
        }
        return myreturn;
      })
    );
  }
}
