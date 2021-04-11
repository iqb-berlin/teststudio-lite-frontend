import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BackendService as UnitBackendService, StrIdLabelSelectedData } from '../backend.service';
import { BackendService as SuperAdminBackendService, GetFileResponseData } from '../../superadmin/backend.service';

@Component({
  templateUrl: './select-authoring-tool.component.html',
  styleUrls: ['./select-authoring-tool.component.css']
})

export class SelectAuthoringToolComponent implements OnInit {
  editorList: StrIdLabelSelectedData[] = [];
  playerList: StrIdLabelSelectedData[] = [];
  selectform: FormGroup;

  constructor(private fb: FormBuilder,
              private bs: UnitBackendService,
              private bs2: SuperAdminBackendService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.selectform = this.fb.group({
      editorSelector: this.fb.control(this.data.editor, [Validators.required]),
      playerSelector: this.fb.control(this.data.player)
    });
    this.bs.getItemAuthoringToolList().subscribe((atL: StrIdLabelSelectedData[] | number) => {
      if (typeof atL !== 'number') {
        if (atL !== null) {
          this.editorList = atL as StrIdLabelSelectedData[];
        }
      }
    });
    this.bs2.getItemPlayerFiles().subscribe(
      (filedataresponse: GetFileResponseData[]) => {
        if (typeof filedataresponse !== 'number') {
          if (filedataresponse !== null) {
            filedataresponse.forEach(f => {
              this.playerList.push({
                id: f.filename,
                label: f.filename,
                selected: false
              });
            });
          }
        }
      }
    );
  }
}
