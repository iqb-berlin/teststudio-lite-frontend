import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DatastoreService } from './../datastore.service';
import { MainDatastoreService } from './../../maindatastore.service';
import { BackendService, UnitShortData, ServerError } from './../backend.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-select-unit',
  templateUrl: './select-unit.component.html',
  styleUrls: ['./select-unit.component.css']
})
export class SelectUnitComponent implements OnInit {
  public dataLoading = false;
  public objectsDatasource: MatTableDataSource<UnitShortData>;
  public displayedColumns = ['selectCheckbox', 'name'];
  private tableselectionCheckbox = new SelectionModel <UnitShortData>(true, []);

  constructor(
    private bs: BackendService,
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.dataLoading = true;
    this.bs.getUnitList(this.mds.token$.getValue(), this.ds.workspaceId$.getValue()).subscribe(
      (dataresponse: UnitShortData[]) => {
        this.objectsDatasource = new MatTableDataSource(dataresponse);
        this.tableselectionCheckbox.clear();
        this.dataLoading = false;
      }, (err: ServerError) => {
        this.objectsDatasource = new MatTableDataSource([]);
        this.tableselectionCheckbox.clear();
        this.dataLoading = false;
      });
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
