import { DatastoreService } from './../datastore.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.css']
})
export class WorkspacesComponent implements OnInit {

  constructor(
    private ds: DatastoreService
  ) { }

  ngOnInit() {
    this.ds.updatePageTitle('Verwaltung: Arbeitsbereiche');
  }

}
