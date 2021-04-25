import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  template: `
    <form [formGroup]="newWorkspaceForm">
      <h1 mat-dialog-title>Neuer Arbeitsbereich</h1>

      <mat-dialog-content fxLayout="column">
        <mat-form-field>
          <input matInput formControlName="name" placeholder="Name" [value]="data.name">
        </mat-form-field>
        <p>
          Nach dem Anlegen des Arbeitsbereiches können Sie die Zugriffsrechte zuweisen.
        </p>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-raised-button color="primary"
                type="submit" [mat-dialog-close]="newWorkspaceForm"
                [disabled]="newWorkspaceForm.invalid">Speichern
        </button>
        <button mat-raised-button [mat-dialog-close]="false">Abbrechen</button>
      </mat-dialog-actions>
    </form>
  `
})
export class NewworkspaceComponent implements OnInit {
  newWorkspaceForm: FormGroup;

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.newWorkspaceForm = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(3)])
    });
  }
}
