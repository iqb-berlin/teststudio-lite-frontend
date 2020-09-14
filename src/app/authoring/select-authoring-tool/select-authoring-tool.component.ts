import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { BackendService, StrIdLabelSelectedData, ServerError } from './../backend.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './select-authoring-tool.component.html',
  styleUrls: ['./select-authoring-tool.component.css']
})

export class SelectAuthoringToolComponent implements OnInit {
  private authoringToolList: StrIdLabelSelectedData[] = [];
  selectform: FormGroup;

  constructor(private fb: FormBuilder,
    private bs: BackendService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.selectform = this.fb.group({
      atSelector: this.fb.control(this.data.authoringTool, [Validators.required])
    });
    this.bs.getItemAuthoringToolList().subscribe((atL: StrIdLabelSelectedData[] | ServerError) => {
      if (atL !== null) {
        if ((atL as ServerError).code === undefined) {
          this.authoringToolList = atL as StrIdLabelSelectedData[];
        }
      }
    });
  }

}
