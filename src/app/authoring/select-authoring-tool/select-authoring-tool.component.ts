import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BackendService, StrIdLabelSelectedData } from '../backend.service';

@Component({
  templateUrl: './select-authoring-tool.component.html',
  styleUrls: ['./select-authoring-tool.component.css']
})

export class SelectAuthoringToolComponent implements OnInit {
  authoringToolList: StrIdLabelSelectedData[] = [];
  selectform: FormGroup;

  constructor(private fb: FormBuilder,
              private bs: BackendService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.selectform = this.fb.group({
      atSelector: this.fb.control(this.data.authoringTool, [Validators.required])
    });
    this.bs.getItemAuthoringToolList().subscribe((atL: StrIdLabelSelectedData[] | number) => {
      if (typeof atL !== 'number') {
        if (atL !== null) {
          this.authoringToolList = atL as StrIdLabelSelectedData[];
        }
      }
    });
  }
}
