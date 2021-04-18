import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModulData } from '../../backend.service';

@Component({
  selector: 'app-select-module',
  templateUrl: './select-module.component.html'
})
export class SelectModuleComponent implements OnInit, OnDestroy, OnChanges {
  @Input() moduleList!: { [key: string]: ModulData; };
  @Input() selectedModuleId!: string;
  @Input() moduleType = '?';
  @Output() selectionChanged = new EventEmitter();
  listLength = 0;
  moduleForm: FormGroup;
  isValid = false;
  isEmpty = false;
  private moduleFormDataChangedSubscription: Subscription = null;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.moduleForm = this.fb.group({
        moduleSelector: this.fb.control('')
      });
      this.setData();
    });
  }

  ngOnChanges(): void {
    if (this.moduleForm) this.setData();
  }

  private setData(): void {
    let newModuleSelectorValue = '';
    if (this.moduleFormDataChangedSubscription !== null) this.moduleFormDataChangedSubscription.unsubscribe();
    this.listLength = this.moduleList ? Object.keys(this.moduleList).length : 0;
    this.isValid = true;
    this.isEmpty = true;
    if (this.selectedModuleId) {
      this.isEmpty = false;
    }
    if (!this.isEmpty) {
      if (this.moduleList[this.selectedModuleId]) {
        newModuleSelectorValue = this.selectedModuleId;
      } else {
        this.isValid = false;
      }
    }
    this.moduleFormDataChangedSubscription = this.moduleForm.valueChanges.subscribe(() => {
      this.selectionChanged.emit(this.moduleForm.get('moduleSelector').value);
    });
    this.moduleForm.setValue({ moduleSelector: newModuleSelectorValue }, { emitEvent: false });
  }

  ngOnDestroy(): void {
    if (this.moduleFormDataChangedSubscription !== null) this.moduleFormDataChangedSubscription.unsubscribe();
  }
}
