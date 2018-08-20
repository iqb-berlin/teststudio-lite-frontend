import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainDatastoreService } from './../../maindatastore.service';
import { Subscriber, Subscription, Observable } from 'rxjs';
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

export class UnitDesignComponent implements OnInit, OnDestroy {
  private routingSubscription: Subscription;
  private myUnitDesign: UnitDesignData = null;
  private hasAuthoringToolDef = false;
  private authoringToolList$: Observable<StrIdLabelSelectedData[] | ServerError>;

  constructor(
    private mds: MainDatastoreService,
    private bs: BackendService,
    private location: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.authoringToolList$ = this.bs.getItemAuthoringToolList();
  }

  ngOnInit() {

    this.routingSubscription = this.route.params.subscribe(
      params => {
        // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        const newUnit: UnitDesignData | ServerError = this.route.snapshot.data['unitDesignData'];

        if (newUnit !== null) {
          console.log(newUnit);
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

}
