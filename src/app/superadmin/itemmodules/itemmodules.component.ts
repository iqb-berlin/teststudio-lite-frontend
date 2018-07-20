import { DatastoreService } from './../datastore.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-itemmodules',
  templateUrl: './itemmodules.component.html',
  styleUrls: ['./itemmodules.component.css']
})
export class ItemmodulesComponent implements OnInit {

  constructor(private ds: DatastoreService
  ) { }

  ngOnInit() {
    this.ds.updatePageTitle('Verwaltung: Item-Module');
 }

}
