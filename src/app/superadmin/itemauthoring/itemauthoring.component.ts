import { MatTableDataSource } from '@angular/material/table';
import {
  ViewChild, Component, OnInit, Inject
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  MessageDialogComponent,
  MessageDialogData,
  MessageType
} from 'iqb-components';
import {
  BackendService, StrIdLabelSelectedData, ServerError, GetFileResponseData
} from '../backend.service';
import { NewItemAuthoringToolComponent } from './new-item-authoring-tool/new-item-authoring-tool.component';
import { EditItemAuthoringToolComponent } from './edit-item-authoring-tool/edit-item-authoring-tool.component';
import { MainDatastoreService } from '../../maindatastore.service';

@Component({
  templateUrl: './itemauthoring.component.html',
  styleUrls: ['./itemauthoring.component.css']
})
export class ItemauthoringComponent implements OnInit {
  dataLoading = false;
  objectsDatasource: MatTableDataSource<StrIdLabelSelectedData> = null;
  displayedColumns = ['selectCheckbox', 'id', 'name'];
  tableselectionCheckbox = new SelectionModel <StrIdLabelSelectedData>(true, []);
  private tableselectionRow = new SelectionModel <StrIdLabelSelectedData>(false, []);
  selectedItemAuthoringToolId = '';

  private filesDatasource: MatTableDataSource<GetFileResponseData> = null;
  displayedColumnsFiles = ['selectCheckbox', 'filename', 'filedatetime', 'filesize'];
  tableselectionCheckboxFiles = new SelectionModel <GetFileResponseData>(true, []);

  @ViewChild(MatSort) sort: MatSort;

  // for FileUpload
  uploadUrl = '';
  token = '';

  constructor(
    @Inject('SERVER_URL') private serverUrl: string,
    private mds: MainDatastoreService,
    private bs: BackendService,
    private newItemAuthoringToolDialog: MatDialog,
    private editItemAuthoringToolDialog: MatDialog,
    private deleteConfirmDialog: MatDialog,
    private messsageDialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.uploadUrl = `${this.serverUrl}php_superadmin/uploadItemAuthoringFile.php`;
    this.tableselectionRow.changed.subscribe(
      r => {
        if (r.added.length > 0) {
          this.selectedItemAuthoringToolId = r.added[0].id;
        } else {
          this.selectedItemAuthoringToolId = '';
        }
        this.updateFileList();
      }
    );
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.updateObjectList();
      this.mds.pageTitle = 'Editoren';
      this.token = localStorage.getItem('t');
    });
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
            (<FormGroup>result).get('id').value,
            (<FormGroup>result).get('name').value
          ).subscribe(
            respOk => {
              if (respOk) {
                this.snackBar.open('Editor hinzugefügt', '', { duration: 1000 });
                this.updateObjectList();
              } else {
                this.snackBar.open('Konnte Editor nicht hinzufügen', 'Fehler', { duration: 1000 });
              }
              this.dataLoading = false;
            }
          );
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
          title: 'Editor ändern',
          content: 'Bitte markieren Sie erst einen Editor!',
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
              selectedRows[0].id,
              (<FormGroup>result).get('id').value,
              (<FormGroup>result).get('name').value
            ).subscribe(
              respOk => {
                if (respOk) {
                  this.snackBar.open('Editor geändert', '', { duration: 1000 });
                  this.updateObjectList();
                } else {
                  this.snackBar.open('Konnte Editor nicht ändern', 'Fehler', { duration: 1000 });
                }
                this.dataLoading = false;
              }
            );
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
          title: 'Löschen von Editoren',
          content: 'Bitte markieren Sie erst Editor/en!',
          type: MessageType.error
        }
      });
    } else {
      let prompt = 'Soll';
      if (selectedRows.length > 1) {
        prompt = `${prompt}en ${selectedRows.length} Editoren `;
      } else {
        prompt = `${prompt} Editor "${selectedRows[0].id}" `;
      }
      const dialogRef = this.deleteConfirmDialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: <ConfirmDialogData>{
          title: 'Löschen von Editoren',
          content: `${prompt}gelöscht werden?`,
          confirmbuttonlabel: 'Editor/en löschen',
          showcancel: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== false) {
          // =========================================================
          this.dataLoading = true;
          const itemAuthoringToolsToDelete = [];
          selectedRows.forEach((r: StrIdLabelSelectedData) => itemAuthoringToolsToDelete.push(r.id));
          this.bs.deleteItemAuthoringTools(itemAuthoringToolsToDelete).subscribe(
            respOk => {
              if (respOk) {
                this.snackBar.open('Editor/en gelöscht', '', { duration: 1000 });
                this.updateObjectList();
                this.dataLoading = false;
              } else {
                this.snackBar.open('Konnte Editor/en nicht löschen', 'Fehler', { duration: 1000 });
                this.dataLoading = false;
              }
            }
          );
        }
      });
    }
  }

  // ***********************************************************************************
  updateObjectList() {
    this.selectedItemAuthoringToolId = '';
    this.updateFileList();

    if (this.mds.loginStatus.isSuperAdmin) {
      this.dataLoading = true;
      this.bs.getItemAuthoringTools().subscribe(
        (dataresponse: StrIdLabelSelectedData[]) => {
          this.objectsDatasource = new MatTableDataSource(dataresponse);
          this.objectsDatasource.sort = this.sort;
          this.tableselectionCheckbox.clear();
          this.tableselectionRow.clear();
          this.dataLoading = false;
        }, () => {
          this.objectsDatasource = null;
          this.tableselectionCheckbox.clear();
          this.tableselectionRow.clear();
          this.dataLoading = false;
        }
      );
    } else {
      this.objectsDatasource = null;
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

  // Files ====================================================================
  isAllSelectedFiles() {
    const numSelected = this.tableselectionCheckboxFiles.selected.length;
    const numRows = this.filesDatasource.data.length;
    return numSelected === numRows;
  }

  masterToggleFiles() {
    this.isAllSelectedFiles() ?
      this.tableselectionCheckboxFiles.clear() :
      this.filesDatasource.data.forEach(row => this.tableselectionCheckboxFiles.select(row));
  }

  hasFiles() {
    if (this.selectedItemAuthoringToolId.length > 0) {
      if (this.filesDatasource == null) {
        return false;
      }
      return this.filesDatasource.data.length > 0;
    }
    return false;
  }

  // ***********************************************************************************
  getDownloadRef(element: GetFileResponseData): string {
    return `${this.serverUrl
    }itemauthoringtools/${this.selectedItemAuthoringToolId}/${element.filename}`;
  }

  updateFileList() {
    if (this.selectedItemAuthoringToolId.length > 0) {
      this.dataLoading = true;
      this.bs.getItemAuthoringToolFiles(this.selectedItemAuthoringToolId).subscribe(
        (filedataresponse: GetFileResponseData[]) => {
          this.filesDatasource = new MatTableDataSource(filedataresponse);
          this.filesDatasource.sort = this.sort;
          this.dataLoading = false;
        }, () => {
          this.filesDatasource = null;
          this.dataLoading = false;
        }
      );
    } else {
      this.filesDatasource = null;
    }
  }

  deleteFiles() {
    const filesToDelete = [];
    this.tableselectionCheckboxFiles.selected.forEach(element => {
      filesToDelete.push(element.filename);
    });

    if (filesToDelete.length > 0) {
      let prompt = 'Sie haben ';
      if (filesToDelete.length > 1) {
        prompt = `${prompt + filesToDelete.length} Dateien ausgewählt. Sollen`;
      } else {
        prompt += ' eine Datei ausgewählt. Soll';
      }
      const dialogRef = this.deleteConfirmDialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: <ConfirmDialogData>{
          title: 'Löschen von Dateien',
          content: `${prompt} diese gelöscht werden?`,
          confirmbuttonlabel: 'Löschen'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== false) {
          // =========================================================
          this.dataLoading = true;
          this.bs.deleteItemAuthoringToolFiles(this.selectedItemAuthoringToolId, filesToDelete).subscribe(
            (deletefilesresponse: string) => {
              if ((deletefilesresponse.length > 5) && (deletefilesresponse.substr(0, 2) === 'e:')) {
                this.snackBar.open(deletefilesresponse.substr(2), 'Fehler', { duration: 1000 });
              } else {
                this.snackBar.open(deletefilesresponse, '', { duration: 1000 });
                this.updateFileList();
              }
            }, (err: ServerError) => {
              this.snackBar.open(err.label, '', { duration: 1000 });
            }
          );
          // =========================================================
        }
      });
    } else {
      this.messsageDialog.open(MessageDialogComponent, {
        width: '400px',
        data: <MessageDialogData>{
          title: 'Löschen von Dateien',
          content: 'Bitte markieren Sie erst Dateien!',
          type: MessageType.error
        }
      });
    }
  }
}
