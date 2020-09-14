import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitPropertiesComponent } from './unitproperties.component';

describe('UnitpropertiesComponent', () => {
  let component: UnitPropertiesComponent;
  let fixture: ComponentFixture<UnitPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
