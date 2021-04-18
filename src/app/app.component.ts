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
        this.mds.loginStatus = newStatus;
      },
      () => {
        this.mds.loginStatus = null;
      });

      window.addEventListener('message', event => {
        this.mds.processMessagePost(event);
      }, false);
    });
  }
}
