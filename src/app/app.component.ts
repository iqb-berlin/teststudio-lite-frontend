// import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { MainDatastoreService } from './maindatastore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  public title = '';
  public isLoggedIn = false;

  constructor (private mds: MainDatastoreService) {}

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
    this.mds.logout();
  }
}
