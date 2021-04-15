import { Component, OnInit } from '@angular/core';
import { MainDatastoreService } from './maindatastore.service';
import { AppHttpError, BackendService } from './backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(
    public mds: MainDatastoreService,
    private bs: BackendService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.bs.getStatus().subscribe(newStatus => {
        this.mds.pageTitle = `Willkommen ${newStatus.name}!`;
        this.mds.loginStatus = newStatus;
      },
      err => {
        this.mds.loginStatus = null;
        this.mds.pageTitle = 'Willkommen!';
      });

      window.addEventListener('message', event => {
        console.log('window.addEventListener', event);
        this.mds.processMessagePost(event);
      }, false);
    });
  }
}
