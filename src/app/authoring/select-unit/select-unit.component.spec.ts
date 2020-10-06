import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUnitComponent } from './select-unit.component';
import {HttpClientModule} from "@angular/common/http";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

describe('SelectUnitComponent', () => {
  let component: SelectUnitComponent;
  let fixture: ComponentFixture<SelectUnitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ SelectUnitComponent ],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {title: 'dummy'}}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
