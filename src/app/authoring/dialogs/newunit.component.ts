import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatastoreService } from '../datastore.service';

@Component({
  template: `
    <div fxLayout="column" style="height: 100%">
      <h1 mat-dialog-title>{{data.title}}</h1>

      <mat-dialog-content>
        <form [formGroup]="newUnitForm" fxLayout="column">
          <mat-form-field>
            <input matInput formControlName="key" placeholder="Kurzname" [value]="data.key" >
            <mat-error *ngIf="newUnitForm.get('key').invalid">
              Zu kurz oder schon vorhanden
            </mat-error>
          </mat-form-field>
          <mat-form-field>
            <input matInput formControlName="label" placeholder="Name" [value]="data.label">
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-raised-button color="primary" type="submit"
                [mat-dialog-close]="newUnitForm" [disabled]="newUnitForm.invalid">Speichern</button>
        <button mat-raised-button [mat-dialog-close]="false">Abbrechen</button>
      </mat-dialog-actions>
    </div>
  `
})
export class NewunitComponent implements OnInit {
  newUnitForm: FormGroup;

  constructor(private fb: FormBuilder,
              public ds: DatastoreService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.newUnitForm = this.fb.group({
      key: this.fb.control('', [Validators.required, Validators.pattern('[a-zA-Z-0-9_]+'),
        Validators.minLength(3),
        DatastoreService.unitKeyUniquenessValidator(0, this.ds.unitList)]),
      label: this.fb.control('')
    });
  }
}
