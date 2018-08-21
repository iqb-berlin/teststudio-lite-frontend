import { DatastoreService, SaveDataComponent } from './../datastore.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainDatastoreService } from './../../maindatastore.service';
import { Subscriber, Subscription, Observable, BehaviorSubject, of } from 'rxjs';
import { BackendService, UnitDesignData, StrIdLabelSelectedData, ServerError } from './../backend.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Location } from '@angular/common';

@Component({
  selector: 'app-unitdesign',
  templateUrl: './unitdesign.component.html',
  styleUrls: ['./unitdesign.component.css']
})

export class UnitDesignComponent implements OnInit, OnDestroy, SaveDataComponent {
  private routingSubscription: Subscription;
  private myUnitDesign: UnitDesignData = null;
  private hasAuthoringToolDef = false;
  private authoringToolList: StrIdLabelSelectedData[] = [];
  public hasChanged$ = new BehaviorSubject<boolean>(false);

  constructor(
    private mds: MainDatastoreService,
    private bs: BackendService,
    private ds: DatastoreService,
    private location: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.bs.getItemAuthoringToolList().subscribe((atL: StrIdLabelSelectedData[] | ServerError) => {
      if (atL !== null) {
        if ((atL as ServerError).code === undefined) {
          this.authoringToolList = atL as StrIdLabelSelectedData[];
        }
      }
    });
  }

  ngOnInit() {
    this.routingSubscription = this.route.params.subscribe(
      params => {
        // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        const newUnit: UnitDesignData | ServerError = this.route.snapshot.data['unitDesignData'];

        this.hasChanged$.next(false);
        this.ds.unitDesignToSave$.next(null);
        if (newUnit !== null) {
          if ((newUnit as UnitDesignData).id !== undefined) {
            this.myUnitDesign = newUnit as UnitDesignData;
            this.hasAuthoringToolDef = this.myUnitDesign.authoringtool_id !== null;
          } else {
            this.myUnitDesign = null;
          }
        } else {
          this.myUnitDesign = null;
      }
      });
  }

  ngOnDestroy() {
    this.routingSubscription.unsubscribe();
  }
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  selectAuthoringTool(tool_id) {
    console.log(tool_id);
  }

  saveOrDiscard(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  saveData(): Observable<boolean> {
    return of(true);
  }
}
