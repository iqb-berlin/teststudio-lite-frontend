import { DatastoreService } from './../datastore.service';
import { Component } from '@angular/core';


@Component({
  selector: 'superadmin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class SuperadminDashboardComponent {
  public isSuperadmin = false;

  constructor(private ds: DatastoreService) {
    this.ds.isSuperadmin$.subscribe(
      is => this.isSuperadmin = is);
  }

}
