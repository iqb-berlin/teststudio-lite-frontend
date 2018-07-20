import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'tc-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public confirmdata: ConfirmDialogData) {

  }

  ngOnInit() {
    if ((typeof this.confirmdata.title === 'undefined') || (this.confirmdata.title.length === 0)) {
      this.confirmdata.title = 'Bitte bestätigen!';
    }
    if ((typeof this.confirmdata.confirmbuttonlabel === 'undefined') || (this.confirmdata.confirmbuttonlabel.length === 0)) {
      this.confirmdata.confirmbuttonlabel = 'Bestätigen';
    }
  }

}

export interface ConfirmDialogData {
  title: string;
  content: string;
  confirmbuttonlabel: string;
}
