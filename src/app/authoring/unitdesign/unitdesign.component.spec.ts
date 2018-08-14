import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitdesignComponent } from './unitdesign.component';

describe('UnitdesignComponent', () => {
  let component: UnitdesignComponent;
  let fixture: ComponentFixture<UnitdesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitdesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitdesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
