import { Component, OnInit } from '@angular/core';
import { MainDatastoreService } from './maindatastore.service';
import { BackendService } from './backend.service';

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
        if (typeof newStatus === 'number') {
          this.mds.loginStatus = null;
          this.mds.pageTitle = 'Willkommen!';
        } else {
          this.mds.pageTitle = `Willkommen ${newStatus.name}!`;
          this.mds.loginStatus = newStatus;
        }
      });

      window.addEventListener('message', event => {
        this.mds.processMessagePost(event);
      }, false);
    });
  }
}
