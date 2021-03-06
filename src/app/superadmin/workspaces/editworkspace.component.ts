import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  template: `
    <form [formGroup]="editWorkspaceForm">
      <h1 mat-dialog-title>{{data.title}}</h1>

      <mat-dialog-content>
        <p>
          <mat-form-field class="full-width">
            <input matInput formControlName="name" placeholder="Name" [value]="data.name">
          </mat-form-field>
        </p>
        <mat-form-field>
          <mat-select placeholder="Gruppe" formControlName="groupSelector">
            <mat-option *ngFor="let wsg of data.groups" [value]="wsg.id">
              {{wsg.label}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-raised-button color="primary"
                type="submit" [mat-dialog-close]="editWorkspaceForm"
                [disabled]="editWorkspaceForm.invalid">{{data.saveButtonLabel}}
        </button>
        <button mat-raised-button [mat-dialog-close]="false">Abbrechen</button>
      </mat-dialog-actions>

    </form>
  `
})
export class EditworkspaceComponent implements OnInit {
  editWorkspaceForm: FormGroup;

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.editWorkspaceForm = this.fb.group({
      name: this.fb.control(this.data.name, [Validators.required, Validators.minLength(3)]),
      groupSelector: this.fb.control(this.data.group, [Validators.required])
    });
  }
}
