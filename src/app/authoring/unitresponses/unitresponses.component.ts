import { DatastoreService } from './../datastore.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unitresponses',
  templateUrl: './unitresponses.component.html',
  styleUrls: ['./unitresponses.component.css']
})
export class UnitresponsesComponent implements OnInit {

  constructor(
    private ds: DatastoreService
  ) { }

  ngOnInit() {
    this.ds.unitViewMode$.next('ur');
  }

}
