import { MatTableDataSource } from '@angular/material/table';
import {
  ViewChild, Component, OnInit, Inject
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  MessageDialogComponent,
  MessageDialogData,
  MessageType
} from 'iqb-components';
import { BackendService, ServerError, GetFileResponseData } from '../backend.service';
import { MainDatastoreService } from '../../maindatastore.service';

@Component({
  templateUrl: './itemplayer.component.html',
  styleUrls: ['./itemplayer.component.css']
})
export class ItemplayerComponent implements OnInit {
  dataLoading = false;
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
    this.uploadUrl = `${this.serverUrl}php_superadmin/uploadItemPlayerFile.php`;
  }

  ngOnInit() {
    this.mds.pageTitle = 'Item-Player';
    this.updateFileList();
    this.token = localStorage.getItem('t');
  }

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
    if (this.filesDatasource == null) {
      return false;
    }
    return this.filesDatasource.data.length > 0;
  }

  // ***********************************************************************************
  getDownloadRef(element: GetFileResponseData): string {
    return `${this.serverUrl
    }itemplayers/${element.filename}`;
  }

  updateFileList() {
    this.dataLoading = true;
    this.bs.getItemPlayerFiles().subscribe(
      (filedataresponse: GetFileResponseData[]) => {
        this.filesDatasource = new MatTableDataSource(filedataresponse);
        this.filesDatasource.sort = this.sort;
        this.dataLoading = false;
      }, () => {
        this.filesDatasource = null;
        this.dataLoading = false;
      }
    );
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
          confirmbuttonlabel: 'Löschen',
          showcancel: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== false) {
          // =========================================================
          this.dataLoading = true;
          this.bs.deleteItemPlayerFiles(filesToDelete).subscribe(
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
