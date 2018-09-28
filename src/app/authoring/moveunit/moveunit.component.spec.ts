import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveunitComponent } from './moveunit.component';

describe('MoveunitComponent', () => {
  let component: MoveunitComponent;
  let fixture: ComponentFixture<MoveunitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveunitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveunitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
