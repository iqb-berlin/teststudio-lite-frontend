import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatastoreService } from '../datastore.service';

@Component({
  templateUrl: './newunit.component.html'
})
export class NewunitComponent implements OnInit {
  newUnitForm: FormGroup;

  constructor(private fb: FormBuilder,
              public ds: DatastoreService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.newUnitForm = this.fb.group({
      key: this.fb.control('', [Validators.required, Validators.pattern('[a-zA-Z-0-9_]+'),
        Validators.minLength(3),
        DatastoreService.unitKeyUniquenessValidator(0, this.ds.unitList)]),
      label: this.fb.control('')
    });
  }
}
