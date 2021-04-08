import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  BehaviorSubject, Subscription, Observable, of
} from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogData } from 'iqb-components';
import { BackendService, UnitProperties } from '../backend.service';
import { MainDatastoreService } from '../../maindatastore.service';
import { DatastoreService, SaveDataComponent } from '../datastore.service';
import { SelectAuthoringToolComponent } from '../select-authoring-tool/select-authoring-tool.component';

@Component({
  templateUrl: './unitproperties.component.html',
  styleUrls: ['./unitproperties.component.css']
})
export class UnitPropertiesComponent implements OnInit, OnDestroy, SaveDataComponent {
  private routingSubscription: Subscription;
  myUnitProps: UnitProperties = null;
  private unitpropsForm: FormGroup;
  hasChanged$ = new BehaviorSubject<boolean>(false);

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
      key: this.fb.control('', [Validators.required, Validators.pattern('[a-zA-Z-0-9_]+'), Validators.minLength(3)]),
      label: this.fb.control('')
    });

    this.routingSubscription = this.route.params.subscribe(
      () => {
        const newUnit: UnitProperties | number = this.route.snapshot.data.unitProperties;

        this.hasChanged$.next(false);
        this.ds.unitPropertiesToSave$.next(null);
        if (newUnit) {
          if ((newUnit as UnitProperties).id !== undefined) {
            this.myUnitProps = newUnit as UnitProperties;
            this.unitpropsForm.setValue(
              { key: this.myUnitProps.key, label: this.myUnitProps.label },
              { emitEvent: false }
            );
          } else {
            this.myUnitProps = null;
            this.unitpropsForm.setValue(
              { key: '', label: '' },
              { emitEvent: false }
            );
          }
        } else {
          this.myUnitProps = null;
          this.unitpropsForm.setValue(
            { key: '', label: '' },
            { emitEvent: false }
          );
        }
        if (this.myUnitProps === null) {
          this.ds.updatePageTitle('Ändern Eigenschaften');
          this.ds.selectedUnit$.next(0);
        } else {
          this.ds.updatePageTitle(`Ändern Eigenschaften: ${this.myUnitProps.key}`);
          this.ds.selectedUnit$.next(this.myUnitProps.id);
        }
      }
    );

    this.unitpropsForm.valueChanges.subscribe(() => {
      this.hasChanged$.next(true);
      this.ds.unitPropertiesToSave$.next(this);
    });
  }

  changeAuthoringTool(): void {
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
          this.ds.selectedWorkspace,
          this.myUnitProps.id,
          myNewAuthoringTool
        ).subscribe(setResult => {
          if (setResult === true) {
            this.myUnitProps.authoringtoolid = myNewAuthoringTool;
            this.hasChanged$.next(true);
            this.ds.unitPropertiesToSave$.next(this);
          }
        });
      }
    });
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  ngOnDestroy(): void {
    this.routingSubscription.unsubscribe();
  }

  saveOrDiscard(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.hasChanged$.getValue() === false) {
      return true;
    }
    if (this.unitpropsForm.invalid) {
      const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
        width: '500px',
        height: '300px',
        data: <ConfirmDialogData>{
          title: 'Änderungen verwerfen?',
          content: 'Sie haben Daten dieser Aufgabe geändert, diese Änderungen sind aber ungültig und ' +
                'können nicht gespeichert werden. Möchten Sie diese Änderungen verwerfen?',
          confirmbuttonlabel: 'Änderungen verwerfen',
          showcancel: true
        }
      });
      return dialogRef.afterClosed().pipe(
        switchMap(result => {
          if (result === false) {
            return of(false);
          }
          return of(true);
        })
      );
    }
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '500px',
      height: '300px',
      data: <ConfirmDialogData>{
        title: 'Speichern',
        content: 'Sie haben Daten dieser Aufgabe geändert. Möchten Sie diese Änderungen speichern?',
        confirmbuttonlabel: 'Speichern',
        showcancel: true
      }
    });
    return dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (result === false) {
          return of(false);
        }
        if (result === 'NO') {
          return of(true);
        } // 'YES'

        return this.saveData();
      })
    );
  }

  saveData(): Observable<boolean> {
    if (this.unitpropsForm.invalid) {
      console.log('unitproperties: saveData unitpropsForm.invalid');
      return of(false);
    }
    this.myUnitProps.key = this.unitpropsForm.get('key').value;
    this.myUnitProps.label = this.unitpropsForm.get('label').value;

    return this.bs.changeUnitProperties(
      this.ds.selectedWorkspace,
      this.myUnitProps
    )
      .pipe(
        switchMap(saveResult => {
          const myreturn = (typeof saveResult === 'boolean') ? saveResult : false;
          if (myreturn) {
            this.hasChanged$.next(false);
            this.ds.unitPropertiesToSave$.next(null);
          }
          return of(myreturn);
        })
      );
  }
}
