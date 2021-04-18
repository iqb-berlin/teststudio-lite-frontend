import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { VeronaModuleData } from '../backend.service';

@Component({
  selector: 'app-verona-modules-table',
  templateUrl: './verona-modules-table.component.html'
})
export class VeronaModulesTableComponent implements OnChanges, OnInit, OnDestroy {
  @Input() objectList!: VeronaModuleData[];
  @Input() downloadPath: string = '';
  @Output() selectionChanged = new EventEmitter();
  @ViewChild(MatSort) sort: MatSort;
  objectsDatasource: MatTableDataSource<VeronaModuleData> = null;
  tableSelectionCheckboxes = new SelectionModel <VeronaModuleData>(true, []);
  timeZone: string = 'Europe/Berlin';
  displayedColumns = ['selectCheckbox', 'name', 'id', 'version', 'verona-version', 'filedatetime', 'filesize'];
  private selectionChangedSubscription: Subscription = null;

  constructor() {
    this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  ngOnInit(): void {
    this.selectionChangedSubscription = this.tableSelectionCheckboxes.changed.subscribe(() => {
      this.selectionChanged.emit(this.tableSelectionCheckboxes.selected.map(element => element.id));
    });
  }

  ngOnChanges(): void {
    if (this.objectList && this.objectList.length > 0) {
      this.objectsDatasource = new MatTableDataSource(this.objectList);
      this.objectsDatasource.sort = this.sort;
    } else {
      this.objectsDatasource = null;
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.tableSelectionCheckboxes.selected.length;
    const numRows = this.objectsDatasource.data.length;
    return numSelected === numRows;
  }

  masterToggleSelection(): void {
    this.isAllSelected() ?
      this.tableSelectionCheckboxes.clear() :
      this.objectsDatasource.data.forEach(row => this.tableSelectionCheckboxes.select(row));
  }

  hasObjects(): boolean {
    if (this.objectsDatasource == null) {
      return false;
    }
    return this.objectsDatasource.data.length > 0;
  }

  ngOnDestroy(): void {
    if (this.selectionChangedSubscription !== null) {
      this.selectionChangedSubscription.unsubscribe();
      this.selectionChangedSubscription = null;
    }
  }
}
