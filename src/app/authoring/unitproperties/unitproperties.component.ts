import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  private unitpropsForm: FormGroup;

  constructor(
    private mds: MainDatastoreService,
    private bs: BackendService,
    private location: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {

  }

  ngOnInit() {
    this.unitpropsForm = this.fb.group({
      key: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      label: this.fb.control('')
    });

    this.routingSubscription = this.route.params.subscribe(
      params => {
        // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        const newUnit: UnitProperties | ServerError = this.route.snapshot.data['unitProperties'];

        if (newUnit !== null) {
          if ((newUnit as UnitProperties).id !== undefined) {
            this.myUnitProps = newUnit as UnitProperties;
            this.unitpropsForm.setValue(
              {key: this.myUnitProps.key, label: this.myUnitProps.label},
              {emitEvent: false}
            );
          } else {
            this.myUnitProps = null;
            this.unitpropsForm.setValue(
              {key: '', label: ''},
              {emitEvent: false}
            );
          }
        } else {
          this.myUnitProps = null;
          this.unitpropsForm.setValue(
            {key: '', label: ''},
            {emitEvent: false}
          );
      }
      });

    this.unitpropsForm.valueChanges.subscribe(val => console.log(val));
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  ngOnDestroy() {
    this.routingSubscription.unsubscribe();
  }
}
