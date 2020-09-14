import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveUnitComponent } from './moveunit.component';

describe('MoveunitComponent', () => {
  let component: MoveUnitComponent;
  let fixture: ComponentFixture<MoveUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
