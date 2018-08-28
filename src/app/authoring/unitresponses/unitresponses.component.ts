import { DatastoreService } from './../datastore.service';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './unitresponses.component.html',
  styleUrls: ['./unitresponses.component.css']
})
export class UnitResponsesComponent implements OnInit {

  constructor(
    private ds: DatastoreService
  ) { }

  ngOnInit() {
    this.ds.unitViewMode$.next('ur');
  }

}
