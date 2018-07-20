import { DatastoreService } from './../datastore.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private ds: DatastoreService
  ) { }

  ngOnInit() {
    this.ds.updatePageTitle('Verwaltung: Nutzer');

  }

}
