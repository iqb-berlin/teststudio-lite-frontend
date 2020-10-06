import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItemAuthoringToolComponent } from './new-item-authoring-tool.component';
import {FormBuilder} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";

const matDialogDataStub = {
  id: 'id',
  name: 'name'
};

describe('NewItemAuthoringToolComponent', () => {
  let component: NewItemAuthoringToolComponent;
  let fixture: ComponentFixture<NewItemAuthoringToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewItemAuthoringToolComponent ],
      imports: [MatDialogModule],
      providers: [FormBuilder,  MatDialog,
        { provide: MAT_DIALOG_DATA, useValue: matDialogDataStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewItemAuthoringToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
