import { Component, Input, OnInit } from '@angular/core';
import { BackendService, UnitDesignData } from '../../backend.service';

@Component({
  selector: 'app-unit-editor',
  templateUrl: './unit-editor.component.html',
  styleUrls: ['./unit-editor.component.css']
})
export class UnitEditorComponent implements OnInit {
  @Input() workspaceId: number;
  @Input() unitId: number;
  unitEditorData: UnitDesignData = null;

  constructor(
    private bs: BackendService
  ) { }

  ngOnInit(): void {
    this.bs.getUnitDesignData(this.workspaceId, this.unitId).subscribe(ued => {
      if (typeof ued === 'number') {
        this.unitEditorData = null;
      } else {
        this.unitEditorData = ued;
      }
    });
  }
}
