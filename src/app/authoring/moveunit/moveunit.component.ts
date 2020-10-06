import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatastoreService } from '../datastore.service';
import { MainDatastoreService } from '../../maindatastore.service';
import { BackendService, UnitShortData, WorkspaceData } from '../backend.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import {Component, Inject, AfterViewInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-moveunit',
  templateUrl: './moveunit.component.html',
  styleUrls: ['./moveunit.component.css']
})
export class MoveUnitComponent implements AfterViewInit {

  public dataLoading = false;
  public objectsDatasource: MatTableDataSource<UnitShortData>;
  public displayedColumns = ['selectCheckbox', 'name'];
  public tableselectionCheckbox = new SelectionModel <UnitShortData>(true, []);
  workspaceList: WorkspaceData[] = [];
  selectform: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bs: BackendService,
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.selectform = this.fb.group({
        wsSelector: this.fb.control(0, [Validators.required, Validators.min(1)])
      });

      this.dataLoading = true;
      this.bs.getWorkspaceList(this.mds.token$.getValue()).subscribe(wsListUntyped => {
        const wsList = wsListUntyped as WorkspaceData[];
        wsList.forEach(ws => {
          if (ws.id !== this.data['curentWorkspaceId']) {
            this.workspaceList.push(ws);
          }
        });
      });
      this.bs.getUnitList(this.mds.token$.getValue(), this.ds.workspaceId$.getValue()).subscribe(
        (dataresponse: UnitShortData[]) => {
          this.objectsDatasource = new MatTableDataSource(dataresponse);
          this.tableselectionCheckbox.clear();
          this.dataLoading = false;
        }, () => {
          this.objectsDatasource = new MatTableDataSource([]);
          this.tableselectionCheckbox.clear();
          this.dataLoading = false;
        });
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
