import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitpropertiesComponent } from './unitproperties.component';

describe('UnitpropertiesComponent', () => {
  let component: UnitpropertiesComponent;
  let fixture: ComponentFixture<UnitpropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitpropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitpropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
