import { DatastoreService } from './../datastore.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-itemplayer',
  templateUrl: './itemplayer.component.html',
  styleUrls: ['./itemplayer.component.css']
})
export class ItemplayerComponent implements OnInit {

  constructor(
    private ds: DatastoreService
  ) { }

  ngOnInit() {
    this.ds.updatePageTitle('Item-Player');
  }

}
