import {
  Component, Input, OnChanges, OnInit, SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackendService, UnitProperties } from '../../backend.service';

@Component({
  selector: 'app-unit-metadata',
  templateUrl: './unit-metadata.component.html',
  styleUrls: ['./unit-metadata.component.css']
})
export class UnitMetadataComponent implements OnInit, OnChanges {
  @Input() workspaceId: number;
  @Input() unitId!: number;
  unitMetadata: UnitProperties = null;

  constructor(
    private bs: BackendService
  ) { }

  ngOnInit(): void {
    this.readData();
  }

  private readData(): void {
    if (this.unitId === 0) {
      this.unitMetadata = null;
    } else {
      this.bs.getUnitProperties(this.workspaceId, this.unitId).subscribe(umd => {
        if (typeof umd === 'number') {
          this.unitMetadata = null;
        } else {
          this.unitMetadata = umd;
        }
      });
    }
  }

  ngOnChanges(): void {
    this.readData();
  }
}
