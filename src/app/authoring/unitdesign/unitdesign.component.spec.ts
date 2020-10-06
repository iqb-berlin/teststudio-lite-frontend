import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitDesignComponent } from './unitdesign.component';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from "../../app-routing.module";
import {MatDialogModule} from "@angular/material/dialog";

describe('UnitdesignComponent', () => {
  let component: UnitDesignComponent;
  let fixture: ComponentFixture<UnitDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitDesignComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, AppRoutingModule, MatDialogModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
