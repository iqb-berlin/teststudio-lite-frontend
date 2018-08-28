import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitResponsesComponent } from './unitresponses.component';

describe('UnitResponsesComponent', () => {
  let component: UnitResponsesComponent;
  let fixture: ComponentFixture<UnitResponsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitResponsesComponent ]
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
