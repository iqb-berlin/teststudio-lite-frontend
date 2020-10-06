import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpasswordComponent } from './newpassword.component';
import {FormBuilder} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";

describe('NewpasswordComponent', () => {
  let component: NewpasswordComponent;
  let fixture: ComponentFixture<NewpasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ NewpasswordComponent ],
      providers: [FormBuilder,  MatDialog,
        { provide: MAT_DIALOG_DATA, useValue: {name: '111'} }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
