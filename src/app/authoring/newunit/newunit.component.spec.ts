import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewunitComponent } from './newunit.component';
import {FormBuilder} from "@angular/forms";
import {MatDialog, MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";

describe('NewunitComponent', () => {
  let component: NewunitComponent;
  let fixture: ComponentFixture<NewunitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ NewunitComponent ],
      imports: [MatDialogModule],
      providers: [FormBuilder,  MatDialog,
        { provide: MAT_DIALOG_DATA, useValue: {
            title: '111',
            key: '222',
            label: '333'
          }
        }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewunitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
