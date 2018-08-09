import { DatastoreService } from '../datastore.service';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './itemauthoring.component.html',
  styleUrls: ['./itemauthoring.component.css']
})
export class ItemauthoringComponent implements OnInit {

  constructor(private ds: DatastoreService
  ) { }

  ngOnInit() {
    this.ds.updatePageTitle('Item-Authoring');
 }

}
