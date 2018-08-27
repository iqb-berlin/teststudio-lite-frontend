import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitresponsesComponent } from './unitresponses.component';

describe('UnitresponsesComponent', () => {
  let component: UnitresponsesComponent;
  let fixture: ComponentFixture<UnitresponsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitresponsesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitresponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
