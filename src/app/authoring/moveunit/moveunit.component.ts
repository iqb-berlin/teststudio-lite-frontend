import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Inject, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BackendService, UnitShortData } from '../backend.service';
import { MainDatastoreService } from '../../maindatastore.service';
import { DatastoreService } from '../datastore.service';
import { WorkspaceData } from '../../backend.service';

@Component({
  selector: 'app-moveunit',
  templateUrl: './moveunit.component.html',
  styleUrls: ['./moveunit.component.css']
})
export class MoveUnitComponent implements AfterViewInit {
  dataLoading = false;
  objectsDatasource: MatTableDataSource<UnitShortData>;
  displayedColumns = ['selectCheckbox', 'name'];
  tableselectionCheckbox = new SelectionModel <UnitShortData>(true, []);
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
      this.mds.loginStatus.workspaces.forEach(ws => {
        if (ws.id !== this.data.currentWorkspaceId) {
          this.workspaceList.push(ws);
        }
      });
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
