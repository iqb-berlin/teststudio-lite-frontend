// import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { MainDatastoreService } from './maindatastore.service';
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
    private mds: MainDatastoreService,
    public aboutDialog: MatDialog) { }

  ngOnInit() {
    this.mds.isLoggedIn$.subscribe(
      is => this.isLoggedIn = is);

    this.mds.pageTitle$.subscribe(
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
        status: this.mds.token$.getValue().length > 0 ? ('angemeldet als ' + this.mds.loginName$.getValue()) : 'nicht angemeldet',
        workspace: '-'
      }
    });
  }

  // *******************************************************************************************************
  login() {
    this.mds.login_dialog();
  }

  // *******************************************************************************************************
  logout() {
    this.mds.logout();
  }

}
