import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewuserComponent } from './newuser.component';
import {FormBuilder} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";

const matDialogDataStub = {
  name: 'name'
};

describe('NewuserComponent', () => {
  let component: NewuserComponent;
  let fixture: ComponentFixture<NewuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewuserComponent ],
      imports: [MatDialogModule],
      providers: [FormBuilder,  MatDialog,
        { provide: MAT_DIALOG_DATA, useValue: matDialogDataStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
