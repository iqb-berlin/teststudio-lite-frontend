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
  private showNaviButtons = false;
  private showPageNaviButtons = false;
  private pagePrevEnabled = false;
  private pageNextEnabled = false;

  constructor (
    private mds: MainDatastoreService,
    public aboutDialog: MatDialog) {
      this.mds.showNaviButtons$.subscribe(show => this.showNaviButtons = show);
      this.mds.itemplayerValidPages$.subscribe((pages: string[]) => this.showPageNaviButtons = pages.length  > 1);
      this.mds.itemplayerCurrentPage$.subscribe((p: string) => {
        const validPages = this.mds.itemplayerValidPages$.getValue();
        const pagePos = validPages.indexOf(p);

        this.pageNextEnabled = (pagePos >= 0) && (pagePos < validPages.length - 1);
        this.pagePrevEnabled = (pagePos > 0) && (validPages.length > 1);
      });
    }

  ngOnInit() {
    this.mds.isLoggedIn$.subscribe(
      is => this.isLoggedIn = is);

    this.mds.pageTitle$.subscribe(
      t => {
        this.title = t;
      }
    );

    // give a message to the central message broadcast
    window.addEventListener('message', (event) => {
      this.mds.processMessagePost(event);
    }, false);
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

  // *******************************************************************************************************
  prevPageNaviButtonClick() {
    const validPages = this.mds.itemplayerValidPages$.getValue();
    const p = this.mds.itemplayerCurrentPage$.getValue();
    const pagePos = validPages.indexOf(p);
    if (pagePos > 0) {
      this.mds.itemplayerPageRequest$.next(validPages[pagePos - 1]);
    }
  }
  nextPageNaviButtonClick() {
    const validPages = this.mds.itemplayerValidPages$.getValue();
    const p = this.mds.itemplayerCurrentPage$.getValue();
    const pagePos = validPages.indexOf(p);
    if ((pagePos >= 0) && (pagePos < validPages.length - 1)) {
      this.mds.itemplayerPageRequest$.next(validPages[pagePos + 1]);
    }
  }
}
