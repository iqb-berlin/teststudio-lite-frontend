import { environment } from './../environments/environment';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormGroup } from '@angular/forms';

import { DatastoreService } from './datastore.service';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  public title = '';
  public isLoggedIn = false;

  constructor (
    private ds: DatastoreService,
    private router: Router,
    public aboutDialog: MatDialog) { }

  ngOnInit() {
    this.ds.isLoggedIn$.subscribe(
      is => this.isLoggedIn = is);

    this.ds.pageTitle$.subscribe(
      t => {
        this.title = t;
      }
    );
  }

  // *******************************************************************************************************
  showAboutDialog() {
    const dialogRef = this.aboutDialog.open(AboutDialogComponent, {
      width: '500px',
      data: {
        status: this.ds.token$.getValue().length > 0 ? ('angemeldet als ' + this.ds.loginName$.getValue()) : 'nicht angemeldet',
        workspace: '-'
      }
    });
  }

  // *******************************************************************************************************
  login() {
    this.ds.login_dialog();
  }

  // *******************************************************************************************************
  logout() {
    this.ds.logout();
  }

}
