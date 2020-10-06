import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditworkspaceComponent } from './editworkspace.component';
import {FormBuilder} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";

const matDialogDataStub = {
  name: 'name',
  oldname: 'oldname'
};

describe('EditworkspaceComponent', () => {
  let component: EditworkspaceComponent;
  let fixture: ComponentFixture<EditworkspaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ EditworkspaceComponent ],
      providers: [FormBuilder,  MatDialog,
        { provide: MAT_DIALOG_DATA, useValue: matDialogDataStub }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditworkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
