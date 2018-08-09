import { DatastoreService } from './datastore.service';
import { Component } from '@angular/core';


@Component({
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css']
})
export class SuperadminComponent {
  private isSuperadmin = false;
  public navLinks = [
    {path: 'itemauthoring', label: 'Item-Authoring'},
    {path: 'itemplayer', label: 'Item-Player'},
    {path: 'users', label: 'Nutzer'},
    {path: 'workspaces', label: 'Arbeitsbereiche'}
  ];


  constructor(
    private ds: DatastoreService
  ) {
    this.ds.isSuperadmin$.subscribe(is => {
      this.isSuperadmin = is;
    });
  }
}
