import {
  Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BackendService, UnitProperties } from '../../backend.service';
import { SelectAuthoringToolComponent } from '../../select-authoring-tool/select-authoring-tool.component';
import { DatastoreService } from '../../datastore.service';

@Component({
  selector: 'app-unit-metadata',
  templateUrl: './unit-metadata.component.html',
  styleUrls: ['./unit-metadata.component.css']
})
export class UnitMetadataComponent implements OnInit, OnDestroy, OnChanges {
  @Input() workspaceId: number;
  @Input() unitId!: number;
  unitMetadata: UnitProperties = null;
  unitForm: FormGroup;
  private unitFormDataChangedSubscription: Subscription = null;

  constructor(
    private bs: BackendService,
    private ds: DatastoreService,
    private fb: FormBuilder,
    public confirmDialog: MatDialog,
    public selectAuthoringToolDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.unitForm = this.fb.group({
      key: this.fb.control('', [Validators.required, Validators.pattern('[a-zA-Z-0-9_]+'), Validators.minLength(3)]),
      label: this.fb.control(''),
      description: this.fb.control('')
    });
    this.readData();
  }

  private readData(): void {
    if (this.unitFormDataChangedSubscription !== null) {
      this.unitFormDataChangedSubscription.unsubscribe();
    }
    if (this.unitId === 0) {
      this.unitMetadata = null;
    } else {
      this.bs.getUnitProperties(this.workspaceId, this.unitId).subscribe(umd => {
        if (typeof umd === 'number') {
          this.unitMetadata = null;
          this.unitForm.setValue(
            { key: '', label: '' },
            { emitEvent: false }
          );
        } else {
          this.unitMetadata = umd;
          this.unitForm.setValue(
            { key: this.unitMetadata.key, label: this.unitMetadata.label, description: this.unitMetadata.description },
            { emitEvent: false }
          );
          this.unitFormDataChangedSubscription = this.unitForm.valueChanges.subscribe(() => {
            this.unitMetadata.key = this.unitForm.get('key').value;
            this.unitMetadata.label = this.unitForm.get('label').value;
            this.unitMetadata.description = this.unitForm.get('description').value;
            this.ds.unitMetadata[this.ds.selectedUnit$.getValue()] = this.unitMetadata;
            this.ds.unitMetaDataChanged = true;
            console.log('#sp');
          });
        }
      });
    }
  }

  ngOnChanges(): void {
    this.readData();
  }

  changeEditorPlayer(): void {
    const dialogRef = this.selectAuthoringToolDialog.open(SelectAuthoringToolComponent, {
      width: '400px',
      data: {
        editor: this.unitMetadata.authoringtoolid,
        player: this.unitMetadata.playerid,
        prompt: 'Bitte wählen Sie den Editor!'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult !== false) {
        const myNewAuthoringTool = (<FormGroup>dialogResult).get('editorSelector').value;
        if (myNewAuthoringTool !== this.unitMetadata.authoringtoolid) {
          this.bs.setUnitAuthoringTool(
            this.ds.selectedWorkspace,
            this.unitMetadata.id,
            myNewAuthoringTool
          ).subscribe(setResult => {
            if (setResult === true) {
              this.unitMetadata.authoringtoolid = myNewAuthoringTool;
            }
          });
        }
        const myNewPlayer = (<FormGroup>dialogResult).get('playerSelector').value;
        if (myNewPlayer !== this.unitMetadata.playerid) {
          this.bs.setUnitPlayer(
            this.ds.selectedWorkspace,
            this.unitMetadata.id,
            myNewPlayer
          ).subscribe(setResult => {
            if (setResult === true) {
              this.unitMetadata.playerid = myNewPlayer;
            }
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.unitFormDataChangedSubscription !== null) {
      this.unitFormDataChangedSubscription.unsubscribe();
    }
  }
}
