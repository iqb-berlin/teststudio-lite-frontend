import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DatastoreService } from '../datastore.service';
import { BackendService } from '../backend.service';

@Component({
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {
  navLinks = [
    { path: 'props', label: 'Eigenschaften' },
    { path: 'editor', label: 'Editor' },
    { path: 'preview', label: 'Voransicht' }
  ];

  private routingSubscription: Subscription = null;

  constructor(
    public ds: DatastoreService,
    private bs: BackendService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.routingSubscription = this.route.params.subscribe(params => {
        this.ds.selectedUnit$.next(Number(params.u));
      });
    });
  }
}
