import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitDesignComponent } from './unitdesign.component';

describe('UnitdesignComponent', () => {
  let component: UnitDesignComponent;
  let fixture: ComponentFixture<UnitDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitDesignComponent ]
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
