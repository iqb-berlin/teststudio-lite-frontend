import { Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmDialogComponent, ConfirmDialogData } from 'iqb-components';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackendService, WorkspaceData } from '../backend.service';
import { MainDatastoreService } from '../maindatastore.service';
import { ChangePasswordComponent } from './change-password.component';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  isError = false;
  errorMessage = '';

  constructor(private fb: FormBuilder,
              @Inject('APP_VERSION') readonly appVersion: string,
              @Inject('APP_NAME') readonly appName: string,
              public mds: MainDatastoreService,
              private bs: BackendService,
              public confirmDialog: MatDialog,
              private changePasswordDialog: MatDialog,
              private snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(1)]),
      pw: this.fb.control('', [Validators.required, Validators.minLength(1)])
    });
    setTimeout(() => {
      this.mds.pageTitle = 'Willkommen!';
      this.bs.getStatus().subscribe(newStatus => {
        this.mds.loginStatus = newStatus;
      },
      () => {
        this.mds.loginStatus = null;
      });
    });
  }

  login(): void {
    this.isError = false;
    this.errorMessage = '';
    if (this.loginForm.valid) {
      this.bs.login(this.loginForm.get('name').value, this.loginForm.get('pw').value).subscribe(loginData => {
        this.mds.loginStatus = loginData;
      },
      err => {
        this.isError = true;
        this.errorMessage = `${err.msg()}`;
      });
    }
  }

  logout(): void {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '400px',
      height: '300px',
      data: <ConfirmDialogData>{
        title: 'Abmelden',
        content: 'Möchten Sie sich abmelden?',
        confirmbuttonlabel: 'Abmelden',
        showcancel: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
        this.bs.logout().subscribe(
          () => {
            this.mds.loginStatus = null;
            this.router.navigateByUrl('/');
          }
        );
      }
    });
  }

  changePassword() : void {
    const dialogRef = this.changePasswordDialog.open(ChangePasswordComponent, {
      width: '400px',
      height: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
        this.bs.setUserPassword(result.controls.pw_old.value, result.controls.pw_new1.value).subscribe(
          respOk => {
            this.snackBar.open(
              respOk ? 'Neues Kennwort gespeichert' : 'Konnte Kennwort nicht ändern.',
              respOk ? 'OK' : 'Fehler', { duration: 3000 }
            );
          }
        );
      }
    });
  }

  buttonGotoWorkspace(selectedWorkspace: WorkspaceData): void {
    this.router.navigate([`/a/${selectedWorkspace.id}`]);
  }
}
