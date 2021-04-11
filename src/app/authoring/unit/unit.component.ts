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
        const newUnitId = Number(params.u);
        this.ds.selectedUnit$.next(newUnitId);
        this.bs.getUnitProperties(this.ds.selectedWorkspace, newUnitId).subscribe(umd => {
          if (typeof umd === 'number') {
            this.ds.unitDataNew = null;
            this.ds.unitDataOld = null;
          } else {
            this.ds.unitDataNew = {
              id: umd.id,
              key: umd.key,
              label: umd.label,
              description: umd.description,
              editorId: umd.authoringtoolid,
              playerId: umd.playerid,
              lastChangedStr: umd.lastchangedStr,
              def: ''
            };
            this.ds.unitDataOld = {
              id: umd.id,
              key: umd.key,
              label: umd.label,
              description: umd.description,
              editorId: umd.authoringtoolid,
              playerId: umd.playerid,
              lastChangedStr: umd.lastchangedStr,
              def: ''
            };
          }
          this.ds.unitDataChanged = false;
        });
      });
    });
  }
}
