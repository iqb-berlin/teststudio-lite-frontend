import { Component } from '@angular/core';
import { MainDatastoreService } from '../maindatastore.service';

@Component({
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css']
})
export class SuperadminComponent {
  isSuperadmin = false;
  navLinks = [
    { path: 'users', label: 'Nutzer' },
    { path: 'workspaces', label: 'Arbeitsbereiche' },
    { path: 'editors', label: 'Editoren' },
    { path: 'players', label: 'Player' }
  ];

  constructor(
    public mds: MainDatastoreService
  ) { }
}
