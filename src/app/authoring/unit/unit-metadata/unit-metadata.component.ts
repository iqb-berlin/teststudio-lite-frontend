import {
  Component, Input, OnChanges, OnDestroy, OnInit, EventEmitter, Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UnitData } from '../../authoring.classes';
import { DatastoreService } from '../../datastore.service';

@Component({
  selector: 'app-unit-metadata',
  templateUrl: './unit-metadata.component.html',
  styleUrls: ['./unit-metadata.component.css']
})
export class UnitMetadataComponent implements OnInit, OnDestroy, OnChanges {
  @Input() unitData!: UnitData;
  @Output() unitDataChanged = new EventEmitter();
  unitForm: FormGroup;
  private unitFormDataChangedSubscription: Subscription = null;

  constructor(
    private fb: FormBuilder,
    public ds: DatastoreService
  ) { }

  ngOnInit(): void {
    this.unitForm = this.fb.group({
      key: this.fb.control('', [Validators.required, Validators.pattern('[a-zA-Z-0-9_]+'), Validators.minLength(3)]),
      label: this.fb.control(''),
      description: this.fb.control(''),
      editorSelector: this.fb.control('', [Validators.required]),
      playerSelector: this.fb.control('')
    });
    this.readData();
  }

  private readData(): void {
    if (this.unitFormDataChangedSubscription !== null) {
      this.unitFormDataChangedSubscription.unsubscribe();
    }
    if (this.unitData) {
      this.unitForm.setValue({
        key: this.unitData.key,
        label: this.unitData.label,
        description: this.unitData.description,
        editorSelector: this.unitData.editorId,
        playerSelector: this.unitData.playerId
      },
      { emitEvent: false });
      this.unitFormDataChangedSubscription = this.unitForm.valueChanges.subscribe(() => {
        if (this.unitData) {
          this.unitData.key = this.unitForm.get('key').value;
          this.unitData.label = this.unitForm.get('label').value;
          this.unitData.description = this.unitForm.get('description').value;
          this.unitData.editorId = this.unitForm.get('editorSelector').value;
          this.unitData.playerId = this.unitForm.get('playerSelector').value;
          this.unitDataChanged.emit();
        }
      });
    } else {
      this.unitForm.setValue({
        key: '',
        label: '',
        description: '',
        editorSelector: '',
        playerSelector: ''
      });
    }
  }

  ngOnChanges(): void {
    if (this.unitForm) this.readData();
  }

  ngOnDestroy(): void {
    if (this.unitFormDataChangedSubscription !== null) {
      this.unitFormDataChangedSubscription.unsubscribe();
    }
  }
}
