import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitResponsesComponent } from './unitresponses.component';
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "../../app-routing.module";
import {ReactiveFormsModule} from "@angular/forms";

describe('UnitResponsesComponent', () => {
  let component: UnitResponsesComponent;
  let fixture: ComponentFixture<UnitResponsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitResponsesComponent ],
      imports: [HttpClientModule, AppRoutingModule, ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
