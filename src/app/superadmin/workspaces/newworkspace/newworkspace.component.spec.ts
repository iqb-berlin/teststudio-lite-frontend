import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewworkspaceComponent } from './newworkspace.component';
import {FormBuilder} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";

const matDialogDataStub = {
  name: 'name'
};

describe('NewworkspaceComponent', () => {
  let component: NewworkspaceComponent;
  let fixture: ComponentFixture<NewworkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewworkspaceComponent ],
      providers: [FormBuilder,  MatDialog,
        { provide: MAT_DIALOG_DATA, useValue: matDialogDataStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewworkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
