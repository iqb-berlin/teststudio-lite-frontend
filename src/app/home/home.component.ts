import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmDialogComponent, ConfirmDialogData } from 'iqb-components';
import { MatDialog } from '@angular/material/dialog';
import { AppHttpError, BackendService, WorkspaceData } from '../backend.service';
import { MainDatastoreService } from '../maindatastore.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  isError = false;
  errorMessage = '';

  constructor(private fb: FormBuilder,
              public mds: MainDatastoreService,
              private bs: BackendService,
              public confirmDialog: MatDialog,
              private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(1)]),
      pw: this.fb.control('', [Validators.required, Validators.minLength(1)])
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
        this.errorMessage = `Server meldet Problem: ${err.msg()}`;
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

  buttonGotoWorkspace(selectedWorkspace: WorkspaceData): void {
    this.router.navigate([`/a/${selectedWorkspace.id}`]);
  }
}
