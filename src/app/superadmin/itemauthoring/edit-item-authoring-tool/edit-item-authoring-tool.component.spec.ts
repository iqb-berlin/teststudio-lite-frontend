import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemAuthoringToolComponent } from './edit-item-authoring-tool.component';
import {FormBuilder} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";

const matDialogDataStub = {
  id: 'id',
  oldid: 'oldid',
  name: 'name'
};

describe('EditItemAuthoringToolComponent', () => {
  let component: EditItemAuthoringToolComponent;
  let fixture: ComponentFixture<EditItemAuthoringToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditItemAuthoringToolComponent ],
      imports: [MatDialogModule],
      providers: [FormBuilder,  MatDialog,
        { provide: MAT_DIALOG_DATA, useValue: matDialogDataStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemAuthoringToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
