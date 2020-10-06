import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoveUnitComponent } from './moveunit.component';
import {FormBuilder} from "@angular/forms";
import {BackendService} from "../backend.service";
import {MainDatastoreService} from "../../maindatastore.service";
import {DatastoreService} from "../datastore.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {HttpClientModule} from "@angular/common/http";

describe('MoveunitComponent', () => {
  let component: MoveUnitComponent;
  let fixture: ComponentFixture<MoveUnitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveUnitComponent ],
      imports: [MatDialogModule, HttpClientModule],
      providers: [BackendService, MainDatastoreService, DatastoreService, MatDialog, FormBuilder, { provide: MAT_DIALOG_DATA, useValue: {
          title: 'Aufgabe(n) verschieben',
          buttonlabel: 'Verschieben',
          curentWorkspaceId: 0
      }}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
