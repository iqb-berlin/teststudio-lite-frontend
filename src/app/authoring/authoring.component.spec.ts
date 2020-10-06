import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthoringComponent } from './authoring.component';
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AppRoutingModule} from "../app-routing.module";
import {MatMenuModule} from "@angular/material/menu";

describe('AuthoringComponent', () => {
  let component: AuthoringComponent;
  let fixture: ComponentFixture<AuthoringComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthoringComponent ],
      imports: [HttpClientModule, MatDialogModule, MatSnackBarModule, AppRoutingModule, MatMenuModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
