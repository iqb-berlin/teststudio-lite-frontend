import { MainDatastoreService } from './../../maindatastore.service';
import { Subscriber ,  Subscription } from 'rxjs';
import { BackendService, UnitProperties, ServerError } from './../backend.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Location } from '@angular/common';

@Component({
  templateUrl: './unitproperties.component.html',
  styleUrls: ['./unitproperties.component.css']
})
export class UnitpropertiesComponent implements OnInit, OnDestroy {
  private routingSubscription: Subscription;
  private myUnitProps: UnitProperties = null;

  constructor(
    private mds: MainDatastoreService,
    private bs: BackendService,
    private location: Location,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.routingSubscription = this.route.params.subscribe(
      params => {
        // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        const newUnit: UnitProperties | ServerError = this.route.snapshot.data['unitProperties'];

        if (newUnit !== null) {
          if ((newUnit as UnitProperties).id !== undefined) {
            this.myUnitProps = newUnit as UnitProperties;
            console.log(this.myUnitProps);
          } else {
            this.myUnitProps = null;
          }
        } else {
          this.myUnitProps = null;
        }
      });
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  ngOnDestroy() {
    this.routingSubscription.unsubscribe();
  }
}
