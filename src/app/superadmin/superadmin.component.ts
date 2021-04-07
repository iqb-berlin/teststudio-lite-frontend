import { Component } from '@angular/core';
import { MainDatastoreService } from '../maindatastore.service';

@Component({
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css']
})
export class SuperadminComponent {
  navLinks = [
    { path: 'itemauthoring', label: 'Autorenmodule' },
    { path: 'itemplayer', label: 'Itemplayer' },
    { path: 'users', label: 'Nutzer' },
    { path: 'workspaces', label: 'Arbeitsbereiche' }
  ];

  constructor(
    public mds: MainDatastoreService
  ) { }
}
