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
    public confirmDialog: MatDialog
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
      });

    this.unitpropsForm.valueChanges.subscribe(val => {
      this.hasChanged$.next(true);
      this.ds.unitPropertiesToSave$.next(this);
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
