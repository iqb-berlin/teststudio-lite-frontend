import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAuthoringToolComponent } from './select-authoring-tool.component';
import {FormBuilder} from "@angular/forms";
import {BackendService} from "../backend.service";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {HttpClientModule} from "@angular/common/http";

describe('SelectAuthoringToolComponent', () => {
  let component: SelectAuthoringToolComponent;
  let fixture: ComponentFixture<SelectAuthoringToolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAuthoringToolComponent ],
      imports: [MatDialogModule, HttpClientModule],
      providers: [FormBuilder, BackendService, { provide: MAT_DIALOG_DATA, useValue: {
          authoringTool: 'authoringtoolid',
          prompt: 'Zum Ändern des Autorenmoduls bitte unten auswählen!'
        }}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAuthoringToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
