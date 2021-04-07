import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, Inject } from '@angular/core';
import { DatastoreService } from '../datastore.service';
import { MainDatastoreService } from '../../maindatastore.service';
import { BackendService, UnitShortData } from '../backend.service';

@Component({
  selector: 'app-select-unit',
  templateUrl: './select-unit.component.html',
  styleUrls: ['./select-unit.component.css']
})
export class SelectUnitComponent implements OnInit {
  dataLoading = false;
  objectsDatasource: MatTableDataSource<UnitShortData>;
  displayedColumns = ['selectCheckbox', 'name'];
  tableselectionCheckbox = new SelectionModel <UnitShortData>(true, []);

  constructor(
    private bs: BackendService,
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.dataLoading = true;
    this.bs.getUnitList(this.ds.selectedWorkspace).subscribe(
      (dataresponse: UnitShortData[]) => {
        this.objectsDatasource = new MatTableDataSource(dataresponse);
        this.tableselectionCheckbox.clear();
        this.dataLoading = false;
      }, () => {
        this.objectsDatasource = new MatTableDataSource([]);
        this.tableselectionCheckbox.clear();
        this.dataLoading = false;
      }
    );
  }

  isAllSelected() {
    const numSelected = this.tableselectionCheckbox.selected.length;
    const numRows = this.objectsDatasource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.tableselectionCheckbox.clear() :
      this.objectsDatasource.data.forEach(row => this.tableselectionCheckbox.select(row));
  }
}
