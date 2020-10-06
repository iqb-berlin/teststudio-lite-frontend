// import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { MainDatastoreService } from './maindatastore.service';
import {ConfirmDialogComponent, ConfirmDialogData} from "iqb-components";
import {BackendService, ServerError} from "./backend.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  public title = '';
  public isLoggedIn = false;

  constructor (
    private mds: MainDatastoreService,
    private bs: BackendService,
    public confirmDialog: MatDialog,
    private router: Router) { }

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
  logout() {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '400px',
      height: '300px',
      data:  <ConfirmDialogData>{
        title: 'Abmelden',
        content: 'Möchten Sie sich abmelden?',
        confirmbuttonlabel: 'Abmelden',
        showcancel: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
        this.bs.logout(this.mds.token$.getValue()).subscribe(
          () => {
            this.mds.updateStatus('', '', false, '');
            this.router.navigateByUrl('/');
          }, (err: ServerError) => {
            this.mds.updateStatus('', '', false, err.label);
            this.router.navigateByUrl('/');
          }
        );
      }
    });
  }
}
