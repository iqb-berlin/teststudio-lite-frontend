import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  loginform: FormGroup;

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.loginform = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      pw: this.fb.control('', [Validators.required, Validators.minLength(3)])
    });
  }

  getName(): string {
    return this.loginform.get('name').value;
  }

  getPassword(): string {
    return this.loginform.get('pw').value;
  }
}
