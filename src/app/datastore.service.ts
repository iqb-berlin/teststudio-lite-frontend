import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { IqbCommonModule, ConfirmDialogComponent, ConfirmDialogData } from './iqb-common';
import { BackendService, LoginStatusResponseData, ServerError } from './backend.service';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class DatastoreService {
  public isSuperadmin$ = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public loginName$ = new BehaviorSubject<string>('');
  public pageTitle$ = new BehaviorSubject<string>('');
  public notLoggedInMessage$ = new BehaviorSubject<string>('');
  public token$ = new BehaviorSubject<string>('');

  // .................................................................................
  private _lastloginname = '';

  constructor(
    public loginDialog: MatDialog,
    public confirmDialog: MatDialog,
    private bs: BackendService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const myToken = localStorage.getItem('t');
    if ((myToken === null) || (myToken === undefined)) {
      this.updateStatus('', '', false, '');
    } else {
      this.bs.getStatus(myToken).subscribe(
        (userdata: LoginStatusResponseData) => {
          this.updateStatus(userdata.token, userdata.name, userdata.is_superadmin, '');
        }, (err: ServerError) => {
          this.updateStatus('', '', false, err.label);
      });
    }
  }


  // *******************************************************************************************************
  login_dialog() {
    const dialogRef = this.loginDialog.open(LoginDialogComponent, {
      width: '600px',
      data: {
        lastloginname: this._lastloginname
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        if (result !== false) {
          this.login((<FormGroup>result).get('name').value, (<FormGroup>result).get('pw').value);
        }
      }
    });
  }

  // *******************************************************************************************************
  login(name: string, password: string) {
    this.bs.login(name, password).subscribe(
      (userdata: LoginStatusResponseData) => {
        this.updateStatus(userdata.token, userdata.name, userdata.is_superadmin, '');
      }, (err: ServerError) => {
        this.updateStatus('', '', false, err.label);
      }
    );
  }

  // *******************************************************************************************************
  logout() {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '400px',
      height: '300px',
      data:  <ConfirmDialogData>{
        title: 'Abmelden',
        content: 'Möchten Sie sich abmelden?',
        confirmbuttonlabel: 'Abmelden'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
        this.bs.logout(this.token$.getValue()).subscribe(
          logoutresponse => {
            this.updateStatus('', '', false, '');
          }, (err: ServerError) => {
            this.updateStatus('', '', false, err.label);
          }
        );
      }
    });
  }

  // *******************************************************************************************************
  updatePageTitle(newTitle: string) {
    this.pageTitle$.next(newTitle);
  }

  updateStatus(token: string, name: string, is_superadmin: boolean, message: string) {

    if ((token === null) || (token.length === 0)) {
      this.isLoggedIn$.next(false);
      this.isSuperadmin$.next(false);
      localStorage.removeItem('t');
      this.token$.next('');
      this.loginName$.next('');
      this.notLoggedInMessage$.next(message);
    } else {
      this.isLoggedIn$.next(true);
      this.isSuperadmin$.next(is_superadmin);
      localStorage.setItem('t', token);
      this.token$.next(token);
      this.loginName$.next(name);
      this.notLoggedInMessage$.next('');
    }

    this.router.navigateByUrl('/');
  }
}
