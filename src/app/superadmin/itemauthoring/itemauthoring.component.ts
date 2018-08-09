import { EditItemAuthoringToolComponent } from './edit-item-authoring-tool/edit-item-authoring-tool.component';
import { NewItemAuthoringToolComponent } from './new-item-authoring-tool/new-item-authoring-tool.component';

import { BackendService, GetUserDataResponse, StrIdLabelSelectedData, ServerError } from '../backend.service';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';

import { DatastoreService } from '../datastore.service';
import { Component, OnInit } from '@angular/core';
import { MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmDialogComponent, ConfirmDialogData, MessageDialogComponent,
  MessageDialogData, MessageType } from '../../iqb-common';

@Component({
  templateUrl: './itemauthoring.component.html',
  styleUrls: ['./itemauthoring.component.css']
})
export class ItemauthoringComponent implements OnInit {
  public dataLoading = false;
  public objectsDatasource: MatTableDataSource<StrIdLabelSelectedData>;
  public displayedColumns = ['selectCheckbox', 'id', 'name'];
  private tableselectionCheckbox = new SelectionModel <StrIdLabelSelectedData>(true, []);
  private tableselectionRow = new SelectionModel <StrIdLabelSelectedData>(false, []);
  private selectedItemAuthoringToolId = '';

  private pendingUserChanges = false;
  // public UserlistDatasource: MatTableDataSource<IdLabelSelectedData>;
  // public displayedUserColumns = ['selectCheckbox', 'name'];

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private ds: DatastoreService,
    private bs: BackendService,
    private newItemAuthoringToolDialog: MatDialog,
    private editItemAuthoringToolDialog: MatDialog,
    private deleteConfirmDialog: MatDialog,
    private messsageDialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.tableselectionRow.onChange.subscribe(
      r => {
        if (r.added.length > 0) {
          this.selectedItemAuthoringToolId = r.added[0].id;
        } else {
          this.selectedItemAuthoringToolId = '';
          }
        this.updateFileList();
      });
  }

  ngOnInit() {
    this.updateObjectList();
    this.ds.updatePageTitle('Autorenmodule');
  }

  // ***********************************************************************************
  addObject() {
    const dialogRef = this.newItemAuthoringToolDialog.open(NewItemAuthoringToolComponent, {
      width: '600px',
      data: {
        id: '',
        name: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        if (result !== false) {
          this.dataLoading = true;
          this.bs.addItemAuthoringTool(
              this.ds.token$.getValue(),
              (<FormGroup>result).get('id').value,
              (<FormGroup>result).get('name').value).subscribe(
                respOk => {
                  if (respOk) {
                    this.snackBar.open('Autorenmodul hinzugefügt', '', {duration: 1000});
                    this.updateObjectList();
                  } else {
                    this.snackBar.open('Konnte Autorenmodul nicht hinzufügen', 'Fehler', {duration: 1000});
                  }
                  this.dataLoading = false;
                });
        }
      }
    });
  }

  changeObject() {
    let selectedRows = this.tableselectionRow.selected;
    if (selectedRows.length === 0) {
      selectedRows = this.tableselectionCheckbox.selected;
    }
    if (selectedRows.length === 0) {
      this.messsageDialog.open(MessageDialogComponent, {
        width: '400px',
        data: <MessageDialogData>{
          title: 'Autorenmodul ändern',
          content: 'Bitte markieren Sie erst ein Autorenmodul!',
          type: MessageType.error
        }
      });
    } else {
      const dialogRef = this.editItemAuthoringToolDialog.open(EditItemAuthoringToolComponent, {
        width: '600px',
        data: {
          id: selectedRows[0].id,
          oldid: selectedRows[0].id,
          name: selectedRows[0].label
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (typeof result !== 'undefined') {
          if (result !== false) {
            this.dataLoading = true;
            this.bs.changeItemAuthoringTool(
                this.ds.token$.getValue(),
                selectedRows[0].id,
                (<FormGroup>result).get('id').value,
                (<FormGroup>result).get('name').value).subscribe(
                  respOk => {
                    if (respOk) {
                      this.snackBar.open('Autorenmodul geändert', '', {duration: 1000});
                      this.updateObjectList();
                    } else {
                      this.snackBar.open('Konnte Autorenmodul nicht ändern', 'Fehler', {duration: 1000});
                    }
                    this.dataLoading = false;
                  });
          }
        }
      });
    }
  }

  deleteObject() {
    let selectedRows = this.tableselectionCheckbox.selected;
    if (selectedRows.length === 0) {
      selectedRows = this.tableselectionRow.selected;
    }
    if (selectedRows.length === 0) {
      this.messsageDialog.open(MessageDialogComponent, {
        width: '400px',
        data: <MessageDialogData>{
          title: 'Löschen von Autorenmodulen',
          content: 'Bitte markieren Sie erst Autorenmodul/e!',
          type: MessageType.error
        }
      });
    } else {
      let prompt = 'Soll';
      if (selectedRows.length > 1) {
        prompt = prompt + 'en ' + selectedRows.length + ' Autorenmodule ';
      } else {
        prompt = prompt + ' Autorenmodul "' + selectedRows[0].id + '" ';
      }
      const dialogRef = this.deleteConfirmDialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: <ConfirmDialogData>{
          title: 'Löschen von Autorenmodulen',
          content: prompt + 'gelöscht werden?',
          confirmbuttonlabel: 'Autorenmodul/e löschen'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== false) {
          // =========================================================
          this.dataLoading = true;
          const itemAuthoringToolsToDelete = [];
          selectedRows.forEach((r: StrIdLabelSelectedData) => itemAuthoringToolsToDelete.push(r.id));
          this.bs.deleteItemAuthoringTools(this.ds.token$.getValue(), itemAuthoringToolsToDelete).subscribe(
            respOk => {
              if (respOk) {
                this.snackBar.open('Autorenmodul/e gelöscht', '', {duration: 1000});
                this.updateObjectList();
                this.dataLoading = false;
              } else {
                this.snackBar.open('Konnte Autorenmodul/e nicht löschen', 'Fehler', {duration: 1000});
                this.dataLoading = false;
              }
          });
        }
      });
    }
  }

  // ***********************************************************************************
  updateFileList() {

  }
  /*
  // ***********************************************************************************
  updateUserList() {
    this.pendingUserChanges = false;
    if (this.selectedWorkspaceId > 0) {
      this.dataLoading = true;
      this.bs.getUsersByWorkspace(this.ds.token$.getValue(), this.selectedWorkspaceId).subscribe(
        (dataresponse: IdLabelSelectedData[]) => {
          this.UserlistDatasource = new MatTableDataSource(dataresponse);
          this.dataLoading = false;
        }, (err: ServerError) => {
          // this.ass.updateAdminStatus('', '', [], err.label);
          this.dataLoading = false;
        });
    } else {
      this.UserlistDatasource = null;
    }
  }

  selectUser(ws?: IdLabelSelectedData) {
    ws.selected = !ws.selected;
    this.pendingUserChanges = true;
  }

  saveUsers() {
    this.pendingUserChanges = false;
    if (this.selectedWorkspaceId > 0) {
      this.dataLoading = true;
      this.bs.setUsersByWorkspace(this.ds.token$.getValue(), this.selectedWorkspaceId, this.UserlistDatasource.data).subscribe(
        respOk => {
          if (respOk) {
            this.snackBar.open('Zugriffsrechte geändert', '', {duration: 1000});
          } else {
            this.snackBar.open('Konnte Zugriffsrechte nicht ändern', 'Fehler', {duration: 1000});
          }
          this.dataLoading = false;
        });
    } else {
      this.UserlistDatasource = null;
    }
  }*/

  // ***********************************************************************************
  updateObjectList() {
    this.selectedItemAuthoringToolId = '';
    this.updateFileList();

    if (this.ds.isSuperadmin$.getValue()) {
      this.dataLoading = true;
      this.bs.getItemAuthoringTools(this.ds.token$.getValue()).subscribe(
        (dataresponse: StrIdLabelSelectedData[]) => {
          this.objectsDatasource = new MatTableDataSource(dataresponse);
          this.objectsDatasource.sort = this.sort;
          this.tableselectionCheckbox.clear();
          this.tableselectionRow.clear();
          this.dataLoading = false;
        }, (err: ServerError) => {
          this.tableselectionCheckbox.clear();
          this.tableselectionRow.clear();
          this.dataLoading = false;
        }
      );
    }
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

  selectRow(row) {
    this.tableselectionRow.select(row);
  }
}
