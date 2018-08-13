import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './authoring.component.html',
  styleUrls: ['./authoring.component.css']
})
export class AuthoringComponent implements OnInit {
  private myWorkspaces = [{'id': '2', 'name': 'Zwo'},
    {'id': '8', 'name': 'Acht'},
    {'id': '7', 'name': 'Sieben'}];
    private allUnits = [
      {'id': '33', 'name': '1Soso'},
      {'id': '33', 'name': 'Sosdcd sdcos oihdc oisdhc osidhc o'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'Soso'},
      {'id': '33', 'name': 'SosoX'}
    ];
  private wsSelector = new FormControl();
  constructor() { }

  ngOnInit() {
  }

}
